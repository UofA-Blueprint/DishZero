const assert = require("assert");
const firebase = require("@firebase/testing")


const MY_PROJECT_ID = "dishzero-serviet"
describe("Our social app", () => {
  it("Understands basic addition", () => {
    assert.equal(2 + 2, 4);
  });

  it("Can read items in the read-only collection", async()=>{
    const db = firebase.initializeTestApp({projectId:MY_PROJECT_ID}).firestore()
    const testDoc = db.collection("readonly").doc("testDoc");

    await firebase.assertSucceeds(testDoc.get());
  })
});
