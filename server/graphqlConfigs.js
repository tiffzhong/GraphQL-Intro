const { buildASTSchema } = require("graphql");
const gql = require("graphql-tag");
const index = require("./index");

module.exports = {
  schema: buildASTSchema(gql`
    type Product {
      id: ID
      name: String
      price: Float
      picture: String
      stock: Int
      category: ProductCategory
    }

    type ProductCategory {
      id: ID!
      name: String
      description: String
    }

    type Query {
      products: [Product]
      product(id: ID!): Product
      productCategories: [ProductCategory!]
      productCategory(id: ID!): ProductCategory
    }

    type Mutation {
      submitProduct(input: updateProduct!): Product
      deleteProduct(id: ID!): Product
    }

    input updateProduct {
      id: ID
      name: String!
      price: Float!
      picture: String!
      stock: Int!
      category: Int!
    }
  `),
  root: {
    products: async () => {
      try {
        const db = index.database;
        const products = await db.get_all_products().then(response => response);
        products.forEach(
          product =>
            (product.category = {
              id: product.category_id,
              name: product.category_name,
              description: product.category_description
            })
        );
        console.log(products, "products-----");
        return products;
      } catch (error) {
        console.log("error in products resolver----- ", error);
        throw new Error(error.message);
      }
    },
    product: async ({ id }) => {
      try {
        const db = index.database;
        const product = await db
          .get_product([id])
          .then(response => response[0]);
        product.category = {
          id: product.category_id,
          name: product.category_name,
          description: product.category_description
        };
        return product;
      } catch (error) {
        console.log("error in product resolver----- ", error);
        throw new Error(error.message);
      }
    },
    productCategories: async () => {
      try {
        const db = index.database;
        const productCategories = await db
          .get_all_product_categories()
          .then(response => response);
        return productCategories;
      } catch (error) {
        console.log("error in productcategories resolver----- ", error);
        throw new Error(error.message);
      }
    },
    productCategory: async ({ id }) => {
      try {
        const db = index.database;
        const productCategory = await db
          .get_product_category([id])
          .then(response => response[0]);
        return productCategory;
      } catch (error) {
        console.log("error in productcategory resolver----- ", error);
        throw new Error(error.message);
      }
    },

    submitProduct: async ({
      input: { id, name, price, picture, stock, category }
    }) => {
      try {
        const db = index.database;
        if (id) {
          const product = await db
            .update_product({ id, name, price, picture, stock, category })
            .then(response => response[0]);
          product.category = {
            id: product.category_id,
            name: product.category_name,
            description: product.category_description
          };
          return product;
        } else {
          const product = await db
            .add_product({ name, price, picture, stock, category })
            .then(response => response[0]);
          product.category = {
            id: product.category_id,
            name: product.category_name,
            description: product.category_description
          };
          return product;
        }
      } catch (error) {
        console.log("error in mutation resolver----- ", error);
        throw new Error(error.message);
      }
    },
    deleteProduct: async ({ id }) => {
      try {
        const db = index.database;
        const deleteResponse = await db.delete_product([id]);
        return deleteResponse;
      } catch (error) {
        console.log("error in mutation delete resolver----- ", error);
        throw new Error(error.message);
      }
    }
  }
};
