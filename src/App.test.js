import React from 'react';
import countriesReducer, {sortAlphabetically} from './features/countrySlice';
import App from './App';
import {render, fireEvent, screen, within} from './test-utils';

test('should return initial countries state', () => {
  expect(countriesReducer(undefined, {})).toEqual(
    {
      entities: {},
      status: 'idle',
      error: null,
      ids: []
    }
  )
})

const countriesStub = [
  {label: 'Austria'},
  {label: 'Australia'},
  {label: 'Argentina'},
  {label: 'Aruba'}
]

test('should return countries sorted alphabetically', () => {
  expect(countriesStub.sort(sortAlphabetically)).toEqual([
    {label: 'Argentina'},
    {label: 'Aruba'},
    {label: 'Australia'},
    {label: 'Austria'},
  ])
})

test('fetches countries data and shows spinner while loading', async () => {
  render(<App />)

  // should show circular progress bar while waiting for countries response data
  expect(screen.getByRole('progressbar')).toBeInTheDocument()
  // dropdown menu should not be visible while spinner is shown
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument()

  // after request is complete the dropdown should be visible and spinner should be gone
  expect(await screen.findByRole('combobox')).toBeInTheDocument()
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
})

test('dropdown displays options and updates correctly', async () => {
  render(<App />)

  // after request is complete the dropdown should be visible and spinner should be gone
  expect(await screen.findByRole('combobox')).toBeInTheDocument()

  const autocomplete = screen.getByTestId('autocomplete');
  const countriesInput = within(autocomplete).getByPlaceholderText('Select');

  // When the dropdown is selected the country options should be visible
  fireEvent.mouseDown(countriesInput)
  expect(screen.getByText(/Australia/i)).toBeInTheDocument()
  expect(screen.getByText(/Austria/i)).toBeInTheDocument()
  expect(screen.getByText(/Argentina/i)).toBeInTheDocument()

  // When "Australia" is entered into the input field and the option is selected
  // its value should be updated
  countriesInput.focus()
  fireEvent.change(document.activeElement, {target: { value: 'Australia'}})
  fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
  fireEvent.keyDown(document.activeElement, { key: 'Enter' })
  expect(countriesInput.value).toEqual('Australia')
})
