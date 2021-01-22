import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';
//import store from 'store-js';


const GET_FIRST_PRODUCTS = gql`
query getProducts($row:Int!){
  products(first: $row) {
    edges {
      cursor
      node {
        id
        title
        priceRangeV2 {
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
`;

function ProductList (){

    const {loading, error, data} = useQuery(GET_FIRST_PRODUCTS, { variables: { row: 20 } });
    if (loading) return <div>loading...</div>
    if (error) return <div>{error.message}</div>
    
    console.log('stored products',data);    
    return(
        <Card>
          <ResourceList
                showHeader
                resourceName={{ singular: 'Product',plural: 'Products' }}
                items={ data.nodes }
                renderItem={ item => {
                    const media = (
                        <Thumbnail 
                            source={
                                item.images.edges[0] ? item.images.edges[0].node.originalSrc :''
                            }
                            alt={
                                item.images.edges[0] ? item.images.edges[0].altText : ''
                            }
                        />
                    );
                    const price  = item.variants.edges[0].node.price;
                    return(
                        <ResourceList.Item
                            id={item.id}
                            media={media}
                            accessibilityLabel={`view Details for ${item.title}`}
                        >
                        <Stack>
                            <Stack.Item fill>
                                <h3>
                                    <TextStyle variation='strong'>
                                        {item.title}
                                    </TextStyle>
                                </h3>
                            </Stack.Item>
                            <Stack.Item>
                                <p>${price}</p>
                            </Stack.Item>
                        </Stack>
                        </ResourceList.Item>
                    )
                }}
            />
        </Card>
    )
}
export default ProductList;