import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { ReactiveVar } from 'meteor/reactive-var';

/* eslint-disable no-undef, object-shorthand, no-shadow*/
const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Edit_Profile_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Edit_Profile_Page');
  this.dataUrl = new ReactiveVar('/images/blank.png');
  this.loadOnce = new ReactiveVar(true);
});

Template.Edit_Profile_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
  profile() {
    return Profiles.findDoc(Meteor.user().profile.name);
  },
  /**
   * Produces the preview of the image
   *
   */
  image_preview() {
    if (_.isUndefined(Profiles.findDoc(Meteor.user().profile.name).picture) && !Template.instance().loadOnce.get()) {
      Template.instance().dataUrl.set('/images/blank.png');
    }
    if (!_.isUndefined(Profiles.findDoc(Meteor.user().profile.name).picture) && Template.instance().loadOnce.get()) {
      Template.instance().dataUrl.set(Profiles.findDoc(Meteor.user().profile.name).picture);
    }
    return Template.instance().dataUrl.get();
  },
});


Template.Edit_Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    const username = Meteor.user().profile.name; // schema requires username.
    const picture = instance.dataUrl.get();
    const bio = event.target.Bio.value;

    const updatedProfileData = { firstName, lastName, picture, bio, username };

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(updatedProfileData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(Meteor.user().profile.name)._id;
      const id = Profiles.update(docID, { $set: updatedProfileData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
  "change input[type='file']": function upload(event, instance) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    //
    const fileReader = new FileReader();
    fileReader.onload = function onload(event) {
      const dataUrl = event.target.result;
      instance.dataUrl.set(dataUrl);
      instance.loadOnce.set(false);
    };
    fileReader.readAsDataURL(file);
  },
});

