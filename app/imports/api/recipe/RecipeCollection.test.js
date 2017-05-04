import { Recipes } from '/imports/api/recipe/RecipeCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';


/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off", no-undef: "off" */

if (Meteor.isServer) {
  describe('RecipeCollection', function testSuite() {
    const recipeID = '1231231231';
    const userID = 22653866;
    const recipeName = 'Mom\'s Spaghetti';
    const firstPublishDate = 	1493152975;
    const lastEditDate = 	1493152975;
    const instructions = 'Put your junk in the box';
    const noServings = 12;
    const totalCost = 12;
    const defineObject = { recipeID, userID, recipeName, firstPublishDate, lastEditDate, instructions,
      noServings, totalCost };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });


    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Recipes.define(defineObject);
      expect(Recipes.isDefined(docID)).to.be.true;

      // Check that fields are available
      const doc = Recipes.findDoc(docID);
      expect(doc.recipeID).to.equal(recipeID);
      expect(doc.userID).to.equal(userID);
      expect(doc.recipeName).to.equal(recipeName);
      expect(doc.firstPublishDate).to.equal(firstPublishDate);
      expect(doc.lastEditDate).to.equal(lastEditDate);
      expect(doc.instructions).to.equal(instructions);
      expect(doc.noServings).to.equal(noServings);
      expect(doc.totalCost).to.equal(totalCost);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Recipes.define(defineObject); }).to.throw(Error);

      // Check that we can dump and restore a Tag.
      const dumpObject = Recipes.dumpOne(docID);
      Recipes.removeIt(docID);
      expect(Recipes.isDefined(docID)).to.be.false;
      docID = Recipes.restoreOne(dumpObject);
      expect(Recipes.isDefined(docID)).to.be.true;
      Recipes.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Recipes.define(defineObject);
      expect(Recipes.isDefined(docID)).to.be.true;
      const docID2 = Recipes.findID(name);
      expect(docID).to.equal(docID2);
      Recipes.findIDs([name, name]);
      Recipes.removeIt(docID);
    });
  });
}

