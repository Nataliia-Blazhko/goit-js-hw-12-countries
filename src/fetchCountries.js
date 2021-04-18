const BASE_URL = 'https://restcountries.eu';

export default function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}/rest/v2/name/${searchQuery}`).then(response => {
    if (!response.ok) {
      throw response;
    }

    return response.json();
  });
}
