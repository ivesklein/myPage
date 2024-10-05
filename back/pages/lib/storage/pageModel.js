const dynamoose = require('dynamoose');

// Define the schema
const pageSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true, // Partition key
  },
  content: String
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Create the model
const Page = dynamoose.model('Page', pageSchema);

module.exports = Page;
