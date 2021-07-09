declareUpdate();
// This tests provenance planned for teh 5.7.0 release
const test = require("/test/test-helper.xqy");
const hubTest = require("/test/data-hub-test-helper.xqy");
const flowProvenance = require("/data-hub/5/flow/flowProvenance.sjs");
const StepExecutionContext = require("/data-hub/5/flow/stepExecutionContext.sjs");
const assertions = [];

function assertValidEntityInstanceProvenance(provDocument) {
  assertions.push(test.assertEqual("Customer", fn.string(provDocument.xpath("/*:document/*:entity/entityName")),
    "The entity name 'Customer' should be captured."
  ));
  assertions.push(test.assertEqual("0.0.1", fn.string(provDocument.xpath("/*:document/*:entity/entityVersion")),
    "The entity version '0.0.1' should be captured."
  ));
  assertions.push(test.assertEqual("data-hub-STAGING", fn.string(provDocument.xpath("/*:document/*:entity/database")),
    "The database 'data-hub-STAGING' should be captured."
  ));
}

function assertValidRelationshipProvenance(provDocument) {
  assertions.push(test.assertEqual("job:my-job-id", fn.string(provDocument.xpath("/*:document/*:wasGeneratedBy/*:activity/@*:ref")),
    "The document should be generated by 'job:my-job-id'."
  ));
  assertions.push(test.assertEqual("step:myStep", fn.string(provDocument.xpath("/*:document/*:wasInfluencedBy/*:influencer/@*:ref")),
    "The document should be influenced by 'step:myStep'."
  ));
  assertions.push(test.assertEqual(`user:${xdmp.getCurrentUser()}`, fn.string(provDocument.xpath("/*:document/*:wasAttributedTo/*:agent/@*:ref")),
    `The document should be wasAttributedTo 'user:${xdmp.getCurrentUser()}'.`
  ));
}

const flowName = "doesntMatter";

const fakeFlow = {
  name:flowName,
  steps: {
    "1": {
      name:"myStep",
      stepDefinitionName: "myCustomStep",
      stepDefinitionType: "custom"
    }
  }
};

let provDocument;
let stepExecutionContext = new StepExecutionContext(fakeFlow, "1", {name:"myCustomStep", type: "custom"}, "my-job-id", { latestProvenance: true, targetDatabase: "data-hub-STAGING" });

// test JSON Object entity instance
stepExecutionContext.completedItems = ["testJSONObjectInstance.json"];
flowProvenance.writeProvenanceData(stepExecutionContext, [
  {uri: "testJSONObjectInstance.json", value: { envelope:{ instance: { info: { title: "Customer", version: "0.0.1"}}}}}
]);


provDocument = hubTest.getFirstProvDocument();
assertValidEntityInstanceProvenance(provDocument);
assertions.push(test.assertEqual("testJSONObjectInstance.json", fn.string(provDocument.xpath("*:document/*:entity/documentURI")),
  "The document URI 'testJSONObjectInstance.json' should be captured."
));
assertValidRelationshipProvenance(provDocument);
hubTest.clearJobsDatabase();

// test JSON Node entity instance
stepExecutionContext.completedItems = ["testJSONNodeInstance.json"];
flowProvenance.writeProvenanceData(stepExecutionContext, [
  {uri: "testJSONNodeInstance.json", value: xdmp.toJSON({ envelope:{ instance: {info: { title: "Customer", version: "0.0.1"}}}})}
]);


provDocument = hubTest.getFirstProvDocument();
assertValidEntityInstanceProvenance(provDocument);
assertions.push(test.assertEqual("testJSONNodeInstance.json", fn.string(provDocument.xpath("*:document/*:entity/documentURI")),
  "The document URI 'testJSONNodeInstance.json' should be captured."
));
assertValidRelationshipProvenance(provDocument);

hubTest.clearJobsDatabase();

// test XML entity instance
stepExecutionContext.completedItems = ["testXMLInstance.xml"];
flowProvenance.writeProvenanceData(stepExecutionContext, [
  {uri: "testXMLInstance.xml", value: fn.head(xdmp.unquote(`
      <envelope xmlns="http://marklogic.com/entity-services">
        <instance>
            <info>
                <title>Customer</title>
                <version>0.0.1</version>
            </info>
        </instance>
      </envelope>`))}
]);


provDocument = hubTest.getFirstProvDocument();
assertValidEntityInstanceProvenance(provDocument);
assertions.push(test.assertEqual("testXMLInstance.xml", fn.string(provDocument.xpath("*:document/*:entity/documentURI")),
  "The document URI 'testXMLInstance.xml' should be captured."
));
assertValidRelationshipProvenance(provDocument);

hubTest.clearJobsDatabase();

assertions;