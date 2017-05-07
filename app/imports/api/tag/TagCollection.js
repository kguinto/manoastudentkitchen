import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

/* eslint no-unused-vars: "off" */

/** @module Tag */


/**
 * Represents a specific Tag, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class TagCollection extends BaseCollection {

  /**
   * Creates the Tag collection.
   */
  constructor() {
    super('Tag', new SimpleSchema({
      recipeID: { type: String },
      tagName: { type: String },
      score: { type: Number },
    }));
  }

  /**
   * Defines a new Tag.
   * @example
   * Tags.define({ tagName: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys tagName and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this tagName and stores it in the slug field.
   * @throws {Meteor.Error} If the Tag definition includes a defined tagName.
   * @returns The newly created docID.
   */
  define({ recipeID, tagName, score }) {
    check(recipeID, String);
    check(tagName, String);
    check(score, Number);
  /*  if (this.find({ tagID }).count() > 0) {
      throw new Meteor.Error(`${tagID} is previously defined in another Tag`);
    } */
    return this._collection.insert({ recipeID, tagName, score });
  }

  /**
   * Returns the Tag tagName corresponding to the passed Tag docID.
   * @param TagID An Tag docID.
   * @returns { String } An Tag tagName.
   * @throws { Meteor.Error} If the Tag docID cannot be found.
   */
  findName(TagID) {
    this.assertDefined(TagID);
    return this.findDoc(TagID).tagName;
  }

  /**
   * Returns a list of Tag tagNames corresponding to the passed list of Tag docIDs.
   * @param TagIDs A list of Tag docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(TagIDs) {
    return TagIDs.map(TagID => this.findName(TagID));
  }

  /**
   * Throws an error if the passed tagName is not a defined Tag tagName.
   * @param tagName The tagName of an Tag.
   */
  assertName(tagName) {
    this.findDoc(tagName);
  }

  /**
   * Throws an error if the passed list of tagNames are not all Tag tagNames.
   * @param tagNames An array of (hopefully) Tag tagNames.
   */
  assertNames(tagNames) {
    _.each(tagNames, tagName => this.assertName(tagName));
  }

  /**
   * Returns the docID associated with the passed Tag tagName, or throws an error if it cannot be found.
   * @param { String } tagName An Tag tagName.
   * @returns { String } The docID associated with the tagName.
   * @throws { Meteor.Error } If tagName is not associated with an Tag.
   */
  findID(tagName) {
    return (this.findDoc(tagName)._id);
  }

  /**
   * Returns the docIDs associated with the array of Tag tagNames, or throws an error if any tagName cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } tagNames An array of Tag tagNames.
   * @returns { String[] } The docIDs associated with the tagNames.
   * @throws { Meteor.Error } If any instance is not an Tag tagName.
   */
  findIDs(tagNames) {
    return (tagNames) ? tagNames.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Tag docID in a format acceptable to define().
   * @param docID The docID of an Tag.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const recipeID = doc.recipeID;
    const tagName = doc.tagName;
    const score = doc.score;
    return { recipeID, tagName, score };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Tags = new TagCollection();
