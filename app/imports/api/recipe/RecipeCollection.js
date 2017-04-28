import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
//import { Interests } from '/imports/api/interest/InterestCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

/** @module Recipe */

/**
 * Recipes provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class RecipeCollection extends BaseCollection {

  /**
   * Creates the Recipe collection.
   */
  constructor() {
    super('Recipe', new SimpleSchema({
      userID: { type: Number },
      recipeID: { type: Number },
      recipeName: { type: String, optional: true },
      firstPublishDate: { type: Number, optional: true },
      lastEditDate: { type: Number, optional: true },
      instructions: { type: String, optional: true },
      noServings: { type: Number, optional: true },
      totalCost: { type: Number, optional: true },
    }));
  }

  /**
   * Defines a new Recipe.
   * @example
   * Recipes.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   interests: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   insreciperam: 'https://insreciperam.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and insreciperam are not URLs.
   * @returns The newly created docID.
   */
  define({ recipeID, userID, recipeName, firstPublishDate, lastEditDate, instructions, noServings, totalCost}) {
    console.log("Define called");
    // make sure required fields are OK.
    const checkPattern = { recipeID: Number, userID: Number, recipeName: String, firstPublishDate: Number, lastEditDate: Number, instructions: String, noServings: Number, totalCost: Number};

    check({ recipeID, userID, recipeName, firstPublishDate, lastEditDate, instructions, noServings, totalCost}, checkPattern);

    if (this.find({ recipeID }).count() > 0) {
      throw new Meteor.Error(`${recipeID} is previously defined in another Recipe`);
    }

    return this._collection.insert({ recipeID, userID, recipeName, firstPublishDate, lastEditDate, instructions, noServings, totalCost});
  }


  /**
   * Returns the Recipe recipeName corresponding to the passed Recipe docID.
   * @param RecipeID An Recipe docID.
   * @returns { String } An Recipe recipeName.
   * @throws { Meteor.Error} If the Recipe docID cannot be found.
   */
  findName(RecipeID) {
    this.assertDefined(RecipeID);
    return this.findDoc(RecipeID).recipeName;
  }

  /**
   * Returns a list of Recipe recipeNames corresponding to the passed list of Recipe docIDs.
   * @param RecipeIDs A list of Recipe docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(RecipeIDs) {
    return RecipeIDs.map(RecipeID => this.findName(RecipeID));
  }

  /**
   * Throws an error if the passed recipeName is not a defined Recipe recipeName.
   * @param recipeName The recipeName of an Recipe.
   */
  assertName(recipeName) {
    this.findDoc(recipeName);
  }

  /**
   * Throws an error if the passed list of recipeNames are not all Recipe recipeNames.
   * @param recipeNames An array of (hopefully) Recipe recipeNames.
   */
  assertNames(recipeNames) {
    _.each(recipeNames, recipeName => this.assertName(recipeName));
  }

  /**
   * Returns the docID associated with the passed Recipe recipeName, or throws an error if it cannot be found.
   * @param { String } recipeName An Recipe recipeName.
   * @returns { String } The docID associated with the recipeName.
   * @throws { Meteor.Error } If recipeName is not associated with an Recipe.
   */
  findID(recipeName) {
    return (this.findDoc(recipeName)._id);
  }

  /**
   * Returns the docIDs associated with the array of Recipe recipeNames, or throws an error if any recipeName cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } recipeNames An array of Recipe recipeNames.
   * @returns { String[] } The docIDs associated with the recipeNames.
   * @throws { Meteor.Error } If any instance is not an Recipe recipeName.
   */
  findIDs(recipeNames) {
    return (recipeNames) ? recipeNames.map((instance) => this.findID(instance)) : [];
  }

  findDocWithRecipeID(recipeID) {
    const doc = this._collection.findOne({ recipeID: recipeID });
    if (!doc) {
      throw new Meteor.Error(`${recipeID} is not a defined ${this._type}`);
    }
    return doc;
  }


  /**
   * Returns an object representing the Recipe docID in a format acceptable to define().
   * @param docID The docID of a Recipe.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const recipeID = doc.recipeID;
    const recipeName = doc.recipeName;
    const userID = doc.userID;
    const firstPublishDate = doc.firstPublishDate;
    const lastEditDate = doc.lastEditDate;
    const instructions = doc.instructions;
    const noServings = doc.noServings;
    const totalCost = doc.totalCost;
    return{ recipeID, userID, recipeName, firstPublishDate, lastEditDate, instructions, noServings, totalCost};
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Recipes = new RecipeCollection();
  console.log("RecipeCollection ");
