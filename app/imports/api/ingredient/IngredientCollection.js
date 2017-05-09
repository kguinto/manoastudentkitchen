import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

/* eslint no-unused-vars: "off" */

/** @module Ingredient */


/**
 * Represents a specific Ingredient, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class IngredientCollection extends BaseCollection {

  /**
   * Creates the Ingredient collection.
   */
  constructor() {
    super('Ingredient', new SimpleSchema({
      recipeID: { type: String },
      ingredientName: { type: String },
      locationID: { type: String },
      price: { type: Number, decimal: true },
      quantity: { type: String },
    }));
  }

  /**
   * Defines a new Ingredient.
   * @example
   * Ingredients.define({ ingredientName: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys ingredientName and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this ingredientName and stores it in the slug field.
   * @throws {Meteor.Error} If the Ingredient definition includes a defined ingredientName.
   * @returns The newly created docID.
   */
  define({ recipeID, ingredientName, locationID, price, quantity }) {
    check(recipeID, String);
    check(ingredientName, String);
    check(locationID, String);
    check(price, Number);
    check(quantity, String);
    /*  if (this.find({ ingredientID }).count() > 0) {
     throw new Meteor.Error(`${ingredientID} is previously defined in another Ingredient`);
     } */
    return this._collection.insert({ recipeID, ingredientName, locationID, price, quantity });
  }

  /**
   * Returns the Ingredient ingredientName corresponding to the passed Ingredient docID.
   * @param IngredientID An Ingredient docID.
   * @returns { String } An Ingredient ingredientName.
   * @throws { Meteor.Error} If the Ingredient docID cannot be found.
   */
  findName(IngredientID) {
    this.assertDefined(IngredientID);
    return this.findDoc(IngredientID).ingredientName;
  }

  /**
   * Returns a list of Ingredient ingredientNames corresponding to the passed list of Ingredient docIDs.
   * @param IngredientIDs A list of Ingredient docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(IngredientIDs) {
    return IngredientIDs.map(IngredientID => this.findName(IngredientID));
  }

  /**
   * Throws an error if the passed ingredientName is not a defined Ingredient ingredientName.
   * @param ingredientName The ingredientName of an Ingredient.
   */
  assertName(ingredientName) {
    this.findDoc(ingredientName);
  }

  /**
   * Throws an error if the passed list of ingredientNames are not all Ingredient ingredientNames.
   * @param ingredientNames An array of (hopefully) Ingredient ingredientNames.
   */
  assertNames(ingredientNames) {
    _.each(ingredientNames, ingredientName => this.assertName(ingredientName));
  }

  /**
   * Returns the docID associated with the passed Ingredient ingredientName, or throws an error if it cannot be found.
   * @param { String } ingredientName An Ingredient ingredientName.
   * @returns { String } The docID associated with the ingredientName.
   * @throws { Meteor.Error } If ingredientName is not associated with an Ingredient.
   */
  findID(ingredientName) {
    return (this.findDoc(ingredientName)._id);
  }

  /**
   * Returns the docIDs associated with the array of Ingredient ingredientNames, or throws an error if any
   * ingredientName cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } ingredientNames An array of Ingredient ingredientNames.
   * @returns { String[] } The docIDs associated with the ingredientNames.
   * @throws { Meteor.Error } If any instance is not an Ingredient ingredientName.
   */
  findIDs(ingredientNames) {
    return (ingredientNames) ? ingredientNames.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Ingredient docID in a format acceptable to define().
   * @param docID The docID of an Ingredient.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const recipeID = doc.recipeID;
    const ingredientName = doc.ingredientName;
    const locationID = doc.locationID;
    const price = doc.price;
    const quantity = doc.quantity;
    return { recipeID, ingredientName, locationID, price, quantity };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Ingredients = new IngredientCollection();
