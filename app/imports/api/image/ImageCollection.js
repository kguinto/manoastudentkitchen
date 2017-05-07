import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

/* eslint no-unused-vars: "off" */

/** @module Image */

/**
 * Represents a specific Image, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class ImageCollection extends BaseCollection {

  /**
   * Creates the Image collection.
   */
  constructor() {
    super('Image', new SimpleSchema({
      recipeID: { type: String },
      imageURL: { type: String },
      deleteHash: { type: String },
    }));
  }

  /**
   * Defines a new Image.
   * @example
   * Images.define({ imageName: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys imageName and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this imageName and stores it in the slug field.
   * @throws {Meteor.Error} If the Image definition includes a defined imageName.
   * @returns The newly created docID.
   */
  define({ recipeID, imageURL, deleteHash }) {
    check(recipeID, String);
    check(imageURL, String);
    check(deleteHash, String);
  /*  if (this.find({ imageID }).count() > 0) {
      throw new Meteor.Error(`${imageID} is previously defined in another Image`);
    } */
    return this._collection.insert({ recipeID, imageURL, deleteHash });
  }

  /**
   * Returns the Image imageName corresponding to the passed Image docID.
   * @param ImageID An Image docID.
   * @returns { String } An Image imageName.
   * @throws { Meteor.Error} If the Image docID cannot be found.
   */
  findName(ImageID) {
    this.assertDefined(ImageID);
    return this.findDoc(ImageID).imageName;
  }

  /**
   * Returns a list of Image imageNames corresponding to the passed list of Image docIDs.
   * @param ImageIDs A list of Image docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(ImageIDs) {
    return ImageIDs.map(ImageID => this.findName(ImageID));
  }

  /**
   * Throws an error if the passed imageName is not a defined Image imageName.
   * @param imageName The imageName of an Image.
   */
  assertName(imageName) {
    this.findDoc(imageName);
  }

  /**
   * Throws an error if the passed list of imageNames are not all Image imageNames.
   * @param imageNames An array of (hopefully) Image imageNames.
   */
  assertNames(imageNames) {
    _.each(imageNames, imageName => this.assertName(imageName));
  }

  /**
   * Returns the docID associated with the passed Image imageName, or throws an error if it cannot be found.
   * @param { String } imageName An Image imageName.
   * @returns { String } The docID associated with the imageName.
   * @throws { Meteor.Error } If imageName is not associated with an Image.
   */
  findID(imageName) {
    return (this.findDoc(imageName)._id);
  }

  /**
   * Returns the docIDs associated with the array of Image imageNames, or throws an error if any imageName
   * cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } imageNames An array of Image imageNames.
   * @returns { String[] } The docIDs associated with the imageNames.
   * @throws { Meteor.Error } If any instance is not an Image imageName.
   */
  findIDs(imageNames) {
    return (imageNames) ? imageNames.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Image docID in a format acceptable to define().
   * @param docID The docID of an Image.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const recipeID = doc.recipeID;
    const imageName = doc.imageName;
    const score = doc.score;
    return { recipeID, imageName, score };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Images = new ImageCollection();
