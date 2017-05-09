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

/* eslint-disable no-undef, object-shorthand, no-shadow*/
const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
Template.Create_Recipe_Page.onCreated(function onCreated() {
  this.dataUrl = new ReactiveVar('/images/blank.png');
  this.dataIngs = new ReactiveVar([{ recipeID: '',
    ingredientName: '', locationID: '', price: '', quantity: '' }]);
  this.dataDiffRating = new ReactiveVar(1);
  this.dataLocationList = new ReactiveVar();
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Recipes.getSchema().namedContext('Create_Recipe_Page');
  this.ingscontext = Ingredients.getSchema().namedContext('Create_Recipe_Page');
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Recipes.getPublicationName());
  this.subscribe(Locations.getPublicationName());
  /* IMGUR UPLOAD REACTIVE VARIABLE */
});

Template.Create_Recipe_Page.helpers({
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
    if (!_.isUndefined(Template.instance().dataUrl)) {
      return Template.instance().dataUrl.get();
    }
    return '';
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
});

Template.Create_Recipe_Page.events({
  /* IMGUR UPLOAD EVENTS */
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
    };
    fileReader.readAsDataURL(file);
  },
  'submit .recipe-form'(event, instance) {
    event.preventDefault();
    const image = instance.dataUrl.get();
    const ingList = instance.dataIngs.get();
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
    /* Ingredient are assembled from form */
    const ingredientArr = event.target.Ingredient;
    const quantityArr = event.target.Quantity;
    const priceArr = event.target.Price;
    const locationArr = event.target.Location;
    const arrLength = ingredientArr.length;
    if (typeof(arrLength) === 'undefined') {
      ingList[0].recipeID = 'PLACEHOLDER';
      ingList[0].ingredientName = ingredientArr.value;
      ingList[0].quantity = quantityArr.value;
      ingList[0].price = parseFloat(priceArr.value);
      ingList[0].locationID = locationArr.value;
      Template.instance().dataIngs.set(ingList);
    } else {
      const mappedArr = _.map(ingredientArr, function ingmap(key, i) {
        return { recipeID: 'PLACEHOLDER', ingredientName: key.value, quantity: quantityArr[i].value,
          price: parseFloat(priceArr[i].value), locationID: locationArr[i].value };
      });
      Template.instance().dataIngs.set(mappedArr);
    }
    _.map(Template.instance().dataIngs.get(), function ingval(obj) {
      const recipeID = obj.recipeID;
      const ingredientName = obj.ingredientName;
      const quantity = obj.quantity;
      const price = obj.price;
      const locationID = obj.locationID;
      console.log({ recipeID, ingredientName, locationID, price, quantity });
      Ingredients.getSchema().clean({ recipeID, ingredientName, locationID, price, quantity });
      instance.ingscontext.validate({ recipeID, ingredientName, locationID, price, quantity });
    });
    console.log(instance.ingscontext.invalidKeys());
    if (instance.context.isValid() && instance.ingscontext.isValid()) {
      /* Inserts new recipe */
     // const id = Recipes.define(newRecipeData);
      console.log("VALID");
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('form').reset();
      instance.$('.dropdown').dropdown('restore defaults');
      FlowRouter.go('Home_Page');
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }




    /*
    Imgur.upload({
      image: image,
      apiKey: Meteor.settings.public.ClientID,
    }, function error(error, data) {
      if (error) {
        throw error;
      } else {
        console.log(data.link);





      }
    });
  */
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
