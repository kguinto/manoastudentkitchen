import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.User_Header.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
});

Template.User_Header.events({
  'submit .search-recipe'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    FlowRouter.go('View_Search_Page', { searchParam: text });
    // Clear form
    target.text.value = '';
  },
});