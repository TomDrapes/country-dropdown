import '@testing-library/jest-dom/extend-expect';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

const mockedCountries = [
  {
    name: {
      common: 'Australia'
    },
    flag: ''
  },
  {
    name: {
      common: 'Austria'
    },
    flag: ''
  },
  {
    name: {
      common: 'Argentina'
    },
    flag: ''
  }
];

export const handlers = [
  rest.get('https://restcountries.com/*', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockedCountries), ctx.delay(150))
  })
]

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())
