import React, { Component } from "react";
import Card from "./Card";
import AddProduct from "./AddProduct";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const GET_PRODUCTS = gql`
  query getProducts {
    products {
      name
      id
      price
      stock
      picture
      category {
        name
        description
        id
      }
    }
  }
`;

export default class ProductDashboard extends Component {
  state = {
    products: []
  };

  render() {
    return (
      <div className="dashboard-container">
        <AddProduct />
        <Query query={GET_PRODUCTS}>
          {/* this is how apollo does it.. */}
          {({ loading, error, data }) => {
            if (loading) return <h1>Loading data...</h1>;
            if (error) return <h1>error</h1>;
            console.log(data);
            return (
              <div>
                {data.products.map((product, index) => (
                  <Card {...product} key={index} />
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
