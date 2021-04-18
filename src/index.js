import './scss/styles.scss';
import fetchCountries from './fetchCountries';
import debounce from 'lodash/debounce';
import { notice, error, defaultStack } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import countriesList from './templates/countriesList.hbs';
import countryData from './templates/countryData.hbs';

const countryCard = document.querySelector('.country-card');
const input = document.querySelector('#enter-country');

const notifyError = message => {
  error({
    text: message,
  });
};

const debouncedQuery = debounce(event => {
  defaultStack.close();
  if (event.target.value.length === 0) {
    countryCard.innerHTML = '';
    return;
  }
  fetchCountries(event.target.value)
    .then(countries => {
      if (countries.length === 1) {
        countryCard.innerHTML = countryData(countries[0]);
      } else if (countries.length >= 2 && countries.length <= 10) {
        countryCard.innerHTML = countriesList(countries);
        const list = document.querySelector('.countriesList');

        list.addEventListener('click', event => {
          if (event.target.nodeName !== 'LI') {
            return;
          }
          input.value = event.target.textContent;

          countryCard.innerHTML = countryData(
            countries.filter(
              country => country.name === event.target.textContent,
            )[0],
          );
        });
      } else if (countries.length > 10) {
        countryCard.innerHTML = '';
        notifyError(
          'Too many matches found.Please enter a more specific query!',
        );
      }
    })
    .catch(err => {
      notifyError('No matches found.Please enter a more specific query!');
      console.error(err);
    });
}, 500);

input.addEventListener('input', debouncedQuery);
