import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Home_Header.helpers({
  routeUserName() {
    return Meteor.user().profile.name;
  },
});
