import { Template } from 'meteor/templating';
import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Images } from '/imports/api/image/ImageCollection';
import { Ingredients } from '/imports/api/ingredient/IngredientCollection';
import { Locations } from '/imports/api/location/LocationCollection';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';


/* eslint-disable no-undef, object-shorthand, no-else-return, no-unused-vars, no-shadow*/
const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
Template.Edit_Recipe_Page.onCreated(function onCreated() {
  this.dataUrl = new ReactiveVar('/images/blank.png');
  this.dataDiffRating = new ReactiveVar(1);
  this.dataLocationList = new ReactiveVar();
  this.dataHasIngError = new ReactiveVar(false);
  this.dataIsSubmittingRecipe = new ReactiveVar(false);
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Recipes.getSchema().namedContext('Edit_Recipe_Page');
  this.ingscontext = Ingredients.getSchema().namedContext('Edit_Recipe_Page');
  this.imageLoaded = new ReactiveVar(0);
 // this.dataIngs = "";
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Locations.getPublicationName());
  this.subscribe(Images.getPublicationName());
  this.subscribe(Ingredients.getPublicationName());

  /* IMGUR UPLOAD REACTIVE VARIABLE */
});

Template.Edit_Recipe_Page.helpers({
  /**
   * Error and success classes.
   *
   */
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
  /**
   * Produces the preview of the image
   *
   */
  image_preview() {
    if (Template.instance().imageLoaded.get() === 0) {
      return _.pluck(_.where(Images.find().fetch(), { recipeID: FlowRouter.getParam('_id') }), 'imageURL')[0];
    } else {
      return Template.instance().dataUrl.get();
    }
  },
  recipe() {
    instance.dataUrl.set(_.pluck(_.where(Images.find().fetch(),
        { recipeID: FlowRouter.getParam('_id') }), 'imageURL')[0]);
    return Recipes.findDocWithRecipeID(FlowRouter.getParam('_id'));
  },
  recipeField(fieldName) {
    const recipe = Recipes.findDocWithRecipeID(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return recipe && recipe[fieldName];
  },
  /**
   * Produces addable ingredient input fields
   *
   */
  ing_field_list() {
    Template.instance().dataLocationList.set([{ label: '', value: '', selected: true }]
        .concat(_.map(Locations.find({}, { fields: { _id: 1, locationName: 1 } }).fetch(),
            function renameLocation(loc) {
              return { label: loc.locationName, value: loc._id, selected: false };
            })));
    return Template.instance().dataIngs.get();
  },
  /**
   * Produces location selection
   *
   */
  location_select_options() {
    return Template.instance().dataLocationList.get();
  },
  has_ing_error() {
    return Template.instance().dataHasIngError.get();
  },
  is_not_submitting_recipe() {
    return !Template.instance().dataIsSubmittingRecipe.get();
  },
  ingredients() {
    Template.instance().dataIngs = new ReactiveVar(_.where(Ingredients.find().fetch(),
        { recipeID: FlowRouter.getParam('_id') }));

    Template.instance().dataLocationList.set([{ label: '', value: '', selected: true }]
        .concat(_.map(Locations.find({}, { fields: { _id: 1, locationName: 1 } }).fetch(),
            function renameLocation(loc) {
              return { label: loc.locationName, value: loc._id, selected: false };
            })));
    return _.where(Ingredients.find().fetch(), { recipeID: FlowRouter.getParam('_id') });
  },
  ingLocation(ing) {
    // console.log(Locations.find().fetch());
    const locations = Locations.find().fetch();
    return _.pluck(_.where(locations, { _id: ing.locationID }), 'locationName')[0];
  },

  ingField(ing, fieldName) {
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return ing && ing[fieldName];
  },

});

Template.Edit_Recipe_Page.events({
  /* IMGUR UPLOAD EVENTS */
  "change input[type='file']": function upload(event, instance) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    instance.imageLoaded.set(1);
    const file = files[0];
    //
    const fileReader = new FileReader();
    fileReader.onload = function onload(event) {
      const dataUrl = event.target.result;
      instance.dataUrl.set(dataUrl);
    };
    fileReader.readAsDataURL(file);
  },
  'submit .recipe-form'(event, instance) {
    event.preventDefault();
    const image = instance.dataUrl.get();
//    const ingList = instance.dataIngs.get();
    const recipeName = event.target['Name of Recipe'].value;
    const difficulty = instance.dataDiffRating.get();
    const timeRequired = event.target['Estimated Time Required'].value;
    const noServings = event.target['Number of Servings'].value;
    const instructions = event.target.Instructions.value;
    const firstPublishDate = Math.floor(Date.now() / 1000);
    const lastEditDate = firstPublishDate;
    const userID = Meteor.user()._id;
    const totalCost = 0;
    const newRecipeData = { userID, recipeName, firstPublishDate, lastEditDate, instructions, noServings, totalCost,
      difficulty, timeRequired };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newContact reflects what will be inserted.
    Recipes.getSchema().clean(newRecipeData);
    // Determine validity.
    instance.context.validate(newRecipeData);

    const quantityArr = event.target.Quantity;
    const priceArr = event.target.Price;
    const locationArr = event.target.Location;
    if (instance.context.isValid()) {
      Template.instance().dataIsSubmittingRecipe.set(true);
      /* Inserts new recipe */

      const id = FlowRouter.getParam('_id');
      Recipes.update(FlowRouter.getParam('_id'), { $set: newRecipeData });

      if (Template.instance().imageLoaded.get() === 1) {
        Images.removeIt(_.pluck(_.where(Images.find().fetch(), { recipeID: FlowRouter.getParam('_id') }), '_id')[0]);

        const recipeID = id;
        const imageURL = image;
        const deleteHash = 'PLACEHOLDER';
        Images.getSchema().clean({ recipeID, imageURL, deleteHash });
        Images.define({ recipeID, imageURL, deleteHash });
      }
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      instance.dataIsSubmittingRecipe.set(false);
      instance.find('form').reset();
      instance.$('.dropdown').dropdown('restore defaults');
      FlowRouter.go('Home_Page');
    } else {
      Template.instance().dataHasIngError.set(true);
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },

  /* END IMGUR UPLOAD EVENTS */
  'click .minus-button'(event, instance) {
    event.preventDefault();
    if (instance.dataIngs.get().length > 1) {
      const currentIngs = instance.dataIngs.get();
      currentIngs.pop();
      instance.dataIngs.set(currentIngs);
    }
  },
  'click .plus-button'(event, instance) {
    event.preventDefault();
    const currentIngs = instance.dataIngs.get();
    currentIngs.push({ recipeID: '',
      ingredientName: '', locationID: '', price: '', size: '', unit: '' });
    instance.dataIngs.set(currentIngs);
  },
  'click .rating'(event, instance) {
    event.preventDefault();
    instance.dataDiffRating.set($(event.target).parent().children('.active').length);
  },
});
