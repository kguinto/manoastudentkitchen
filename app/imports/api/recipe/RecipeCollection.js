import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
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
      firstPublishDate: { type: Date, optional: true },
      lastEditDate: { type: Date, optional: true },
      instructions: { type: String, optional: true },
      noServings: { type: Number, optional: true },
      totalCost: { type: Number, optional: true },
      costPerServing: { type: Number, optional: true },
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
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ recipeID, userID, firstPublishDate = new Date(), lastEditDate = new Date(), instructions = '', noServings = 0, totalCost = 0, costPerServing = 0}) {
    // make sure required fields are OK.
    const checkPattern = { recipeID: Number, userID: Number, firstPublishDate: Date, lastEditDate: Number, instructions: String, noServings: Number, totalCost: Number};

    check({ recipeID, userID, firstPublishDate, lastEditDate, instructions, noServings, totalCost }, checkPattern);

    if (this.find({ recipeID }).count() > 0) {
      throw new Meteor.Error(`${recipeID} is previously defined in another Recipe`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    /*    Interests.assertNames(interests);
     return this._collection.insert({ firstName, lastName, username, bio, interests, picture, title, github,
     facebook, instagram });*/
  }

  /**
   * Returns an object representing the Recipe docID in a format acceptable to define().
   * @param docID The docID of a Recipe.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const recipeID = doc.recipeID;
    const userID = doc.userID;
    const firstPublishDate = doc.firstPublishDate;
    const lastEditDate = doc.lastEditDate;
    const instructions = doc.instructions;
    const noServings = doc.noServings;
    const totalCost = doc.totalCost;
    return{ recipeID, userID, firstPublishDate, lastEditDate, instructions, noServings, totalCost },;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Recipes = new RecipeCollection();
