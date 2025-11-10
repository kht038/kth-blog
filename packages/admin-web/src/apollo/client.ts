import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  credentials: "include", // refresh 쿠키 전송
});

function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}
function setAccessToken(token: string) {
  localStorage.setItem("access_token", token);
}
function clearAccessToken() {
  localStorage.removeItem("access_token");
}

// 요청마다 Authorization 붙이기
const authLink = new SetContextLink(() => {
  const token = getAccessToken();
  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

// 401 처리: refreshToken 후 재시도 (1회)
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    const isUnauthorized =
      (graphQLErrors &&
        graphQLErrors.some((e) => e.extensions?.code === "UNAUTHENTICATED")) ||
      (networkError &&
        "statusCode" in networkError &&
        (networkError as any).statusCode === 401);

    if (!isUnauthorized || (operation.getContext() as any)._retry) return;

    (operation.getContext() as any)._retry = true;

    // refreshToken 요청
    return fetch(import.meta.env.VITE_GRAPHQL_URL, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `mutation{ refreshToken{ accessToken user{ id email name } } }`,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const newToken = json?.data?.refreshToken?.accessToken as
          | string
          | undefined;
        if (newToken) setAccessToken(newToken);
        else clearAccessToken();
      })
      .catch(() => clearAccessToken())
      .finally(() => forward(operation));
  }
);

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export { getAccessToken, setAccessToken, clearAccessToken };
