import client from "client";
import { gql } from "@apollo/client";
import { BlockRenderer } from "components/BlockRenderer";
import { getPageStaticProps } from "utils";

import { Page } from "components/Page";
export default Page;

export const getStaticProps = getPageStaticProps;

export const getStaticPaths = async () => {
  const { data } = await client.query({
    query: gql`
      query AllPagesQuery {
        pages {
          nodes {
            uri
          }
        }
        properties {
          nodes {
            uri
            title
          }
        }
      }
    `,
  });

  return {
    paths: [...data.pages.nodes, ...data.properties.nodes]
      .filter((page) => page.uri !== "/")
      .map((page) => ({
        params: {
          slug: page.uri.substring(1, page.uri.lenght - 1).split("/"),
        },
      })),
    fallback: "blocking",
  };
};
