import { Locations } from '/imports/api/location/LocationCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('LocationCollection', function testSuite() {
    const locationName = 'Test';
    const address = 'Test';
    const defineObject = { locationName, address };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Locations.define(defineObject);
      expect(Locations.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Locations.findDoc(docID);
      expect(doc.locationName).to.equal(locationName);
      expect(doc.address).to.equal(address);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Locations.define(defineObject); }).to.throw(Error);

      // Check that we can dump and restore a Tag.
      const dumpObject = Locations.dumpOne(docID);
      Locations.removeIt(docID);
      expect(Locations.isDefined(docID)).to.be.false;
      docID = Locations.restoreOne(dumpObject);
      expect(Locations.isDefined(docID)).to.be.true;
      Locations.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Locations.define(defineObject);
      expect(Locations.isDefined(docID)).to.be.true;
      const docID2 = Locations.findID(name);
      expect(docID).to.equal(docID2);
      Locations.findIDs([name, name]);
      Locations.removeIt(docID);
    });
  });
}

