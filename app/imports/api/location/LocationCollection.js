import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

/* eslint no-unused-vars: "off" */

/** @module Location */


/**
 * Represents a specific Location, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class LocationCollection extends BaseCollection {

  /**
   * Creates the Location collection.
   */
  constructor() {
    super('Location', new SimpleSchema({
      recipeID: { type: String },
      locationName: { type: String },
      score: { type: Number },
    }));
  }

  /**
   * Defines a new Location.
   * @example
   * Locations.define({ locationName: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys locationName and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this locationName and stores it in the slug field.
   * @throws {Meteor.Error} If the Location definition includes a defined locationName.
   * @returns The newly created docID.
   */
  define({ recipeID, locationName, score }) {
    check(recipeID, String);
    check(locationName, String);
    check(score, Number);
    /*  if (this.find({ locationID }).count() > 0) {
     throw new Meteor.Error(`${locationID} is previously defined in another Location`);
     } */
    return this._collection.insert({ recipeID, locationName, score });
  }

  /**
   * Returns the Location locationName corresponding to the passed Location docID.
   * @param LocationID An Location docID.
   * @returns { String } An Location locationName.
   * @throws { Meteor.Error} If the Location docID cannot be found.
   */
  findName(LocationID) {
    this.assertDefined(LocationID);
    return this.findDoc(LocationID).locationName;
  }

  /**
   * Returns a list of Location locationNames corresponding to the passed list of Location docIDs.
   * @param LocationIDs A list of Location docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(LocationIDs) {
    return LocationIDs.map(LocationID => this.findName(LocationID));
  }

  /**
   * Throws an error if the passed locationName is not a defined Location locationName.
   * @param locationName The locationName of an Location.
   */
  assertName(locationName) {
    this.findDoc(locationName);
  }

  /**
   * Throws an error if the passed list of locationNames are not all Location locationNames.
   * @param locationNames An array of (hopefully) Location locationNames.
   */
  assertNames(locationNames) {
    _.each(locationNames, locationName => this.assertName(locationName));
  }

  /**
   * Returns the docID associated with the passed Location locationName, or throws an error if it cannot be found.
   * @param { String } locationName An Location locationName.
   * @returns { String } The docID associated with the locationName.
   * @throws { Meteor.Error } If locationName is not associated with an Location.
   */
  findID(locationName) {
    return (this.findDoc(locationName)._id);
  }

  /**
   * Returns the docIDs associated with the array of Location locationNames, or throws an error if any locationName cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } locationNames An array of Location locationNames.
   * @returns { String[] } The docIDs associated with the locationNames.
   * @throws { Meteor.Error } If any instance is not an Location locationName.
   */
  findIDs(locationNames) {
    return (locationNames) ? locationNames.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Location docID in a format acceptable to define().
   * @param docID The docID of an Location.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const recipeID = doc.recipeID;
    const locationName = doc.locationName;
    const score = doc.score;
    return { recipeID, locationName, score };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Locations = new LocationCollection();
