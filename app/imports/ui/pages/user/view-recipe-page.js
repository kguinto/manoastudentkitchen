import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

console.log('view recipe page js loaded');

Template.View_Recipe_Page.onCreated(function onCreated() {
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Tags.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Recipes.getSchema().namedContext('View_Recipe_Page');
});

Template.View_Recipe_Page.helpers({
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
  recipe() {
    return Recipes.findDocWithRecipeID( Number(FlowRouter.getParam('recipeID')) );
  },

  costPerServing(){
    let recipe = Recipes.findDocWithRecipeID( Number(FlowRouter.getParam('recipeID')));
    return (recipe.totalCost / recipe.noServings );
  }

});
/*

Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const recip = event.target.First.value;
   /* const lastName = event.target.Last.value;
    const title = event.target.Title.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target.Picture.value;
    const github = event.target.Github.value;
    const facebook = event.target.Facebook.value;
    const instagram = event.target.Instagram.value;
    const bio = event.target.Bio.value;
    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);

    const updatedProfileData = { firstName, lastName, title, picture, github, facebook, instagram, bio, interests,
      username };

    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(updatedProfileData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: updatedProfileData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});*/
