const { HttpError } = require('http-errors');

const validate = require('../middleware/validate');

describe('validate.getHydro', () => {
const dbkeys = {
  valid: [
    '1',
    '12',
    '123',
    '1234',
    '12345',
    'A1234',
    'AB123',
    '12345,67890',
    '12345,67890,AB123',
    '12345,67890,AB123,98765'
  ],
  invalid: [
    '',
    'A',
    'AB',
    'AB1',
    'AB12',
    'ABC12',
    'ABCD1',
    'ABCDE',
    '1234E',
    '123456',
    '12345,ABCDE',
    '12345,1234E',
    '12345,123456',
    '12345/67890',
    '12345-67890'
  ]
};

test.each(dbkeys.invalid)('throws error for malformed dbkey %s', (dbkeys) => {
  const req = { params: { dbkeys } };

    expect(() => validate.getHydro(req)).toThrow(HttpError);
});

test.each(dbkeys.valid)('accepts valid dbkey %s', (dbkeys) => {
  const req = { params: { dbkeys } };
  const next = jest.fn();

    validate.getHydro(req, null, next);

  expect(next).toHaveBeenCalled();
});

test('throws error for unexpected query parameter', () => {
  const req = { params: { dbkeys: '12345' }, query: { nope: 'Chuck Testa' } };

    expect(() => validate.getHydro(req)).toThrow(HttpError);
});

test('throws error for non-ISO from date', () => {
  const req = { params: { dbkeys: '12345' }, query: { from: '20200101'} };

    expect(() => validate.getHydro(req)).toThrow(HttpError);
});

test('throws error for non-ISO to date', () => {
  const req = { params: { dbkeys: '12345' }, query: { to: '20200101'} };

    expect(() => validate.getHydro(req)).toThrow(HttpError);
});

test('throws error for from date in the future', () => {
  const req = { params: { dbkeys: '12345' }, query: { from: '3021-01-01'} };

    expect(() => validate.getHydro(req)).toThrow(HttpError);
});

test('throws error for to date in the future', () => {
  const req = { params: { dbkeys: '12345' }, query: { to: '3021-01-01'} };

    expect(() => validate.getHydro(req)).toThrow(HttpError);
});

test('throws error for from date later than to date', () => {
  const req = { params: { dbkeys: '12345' }, query: { from: '2020-01-01', to: '2019-01-01'} };

    expect(() => validate.getHydro(req)).toThrow(HttpError);
});

test('strips time from from date if provided', () => {
  const req = { params: { dbkeys: '12345' }, query: { from: '2020-01-01T01:23:45.678Z'} };
  const next = jest.fn();

    validate.getHydro(req, null, next);

  expect(req.query.from).toBe('2020-01-01');
  expect(next).toHaveBeenCalled();
});

test('strips time from to date if provided', () => {
  const req = { params: { dbkeys: '12345' }, query: { to: '2020-01-01T01:23:45.678Z'} };
  const next = jest.fn();

    validate.getHydro(req, null, next);

  expect(req.query.to).toBe('2020-01-01');
  expect(next).toHaveBeenCalled();
});

test('sets to date to today if not provided', () => {
  const realDateNow = Date.now.bind(global.Date);
  const dateNowStub = jest.fn(() => (new Date(2020, 0, 1)).getTime());
  global.Date.now = dateNowStub;

  const req = { params: { dbkeys: '12345' } };
  const next = jest.fn();

    validate.getHydro(req, null, next);

  expect(req.query.to).toBe('2020-01-01');
  expect(next).toHaveBeenCalled();

  global.Date.now = realDateNow;
});

test('sets from date to one month before to date if not provided', () => {
  const req = { params: { dbkeys: '12345' }, query: { to: '2020-02-01'} };
  const next = jest.fn();

    validate.getHydro(req, null, next);

  expect(req.query).toEqual({ from: '2020-01-01', to: '2020-02-01' });
  expect(next).toHaveBeenCalled();
});

test('sets to to today and from to one month ago if not provided', () => {
  const realDateNow = Date.now.bind(global.Date);
  const dateNowStub = jest.fn(() => (new Date(2020, 1, 1)).getTime());
  global.Date.now = dateNowStub;

  const req = { params: { dbkeys: '12345' } };
  const next = jest.fn();

    validate.getHydro(req, null, next);

  expect(req.query).toEqual({ from: '2020-01-01', to: '2020-02-01' });
  expect(next).toHaveBeenCalled();

  global.Date.now = realDateNow;
});

test('accepts valid date range', () => {
  const req = { params: { dbkeys: '12345' }, query: { from: '2020-01-01', to: '2020-02-01' } };
  const next = jest.fn();

    validate.getHydro(req, null, next);

    expect(req.query).toEqual({ from: '2020-01-01', to: '2020-02-01' });
    expect(next).toHaveBeenCalled();
  });
});

describe('validate.getErmSonde', () => {
  test('throws error for missing sonde name', () => {
    const req = { params: {} };

    expect(() => validate.getErmSonde(req)).toThrow(HttpError);
  });

  test('validates if sonde name provided', () => {
    const req = { params: { name: 'johns-island' } };
    const next = jest.fn();

    validate.getErmSonde(req, null, next);

    expect(next).toHaveBeenCalled();
  });

  test('throws error for unexpected query parameter', () => {
    const req = { params: { name: 'johns-island' }, query: { nope: 'Chuck Testa' } };
    
    expect(() => validate.getErmSonde(req)).toThrow(HttpError);
  });

  test('throws error for non-ISO from date', () => {
    const req = { params: { name: 'johns-island' }, query: { from: '20200101'} };

    expect(() => validate.getErmSonde(req)).toThrow(HttpError);
  });

  test('throws error for non-ISO to date', () => {
    const req = { params: { name: 'johns-island' }, query: { to: '20200101'} };

    expect(() => validate.getErmSonde(req)).toThrow(HttpError);
  });

  test('throws error for from date in the future', () => {
    const req = { params: { name: 'johns-island' }, query: { from: '3021-01-01'} };

    expect(() => validate.getErmSonde(req)).toThrow(HttpError);
  });

  test('throws error for to date in the future', () => {
    const req = { params: { name: 'johns-island' }, query: { to: '3021-01-01'} };

    expect(() => validate.getErmSonde(req)).toThrow(HttpError);
  });

  test('throws error for from date later than to date', () => {
    const req = { params: { name: 'johns-island' }, query: { from: '2020-01-01', to: '2019-01-01'} };

    expect(() => validate.getErmSonde(req)).toThrow(HttpError);
  });

  test('strips time from from date if provided', () => {
    const req = { params: { name: 'johns-island' }, query: { from: '2020-01-01T01:23:45.678Z'} };
    const next = jest.fn();

    validate.getErmSonde(req, null, next);

    expect(req.query.from).toBe('2020-01-01');
    expect(next).toHaveBeenCalled();
  });

  test('strips time from to date if provided', () => {
    const req = { params: { name: 'johns-island' }, query: { to: '2020-01-01T01:23:45.678Z'} };
    const next = jest.fn();

    validate.getErmSonde(req, null, next);

    expect(req.query.to).toBe('2020-01-01');
    expect(next).toHaveBeenCalled();
  });

  test('sets to date to today if not provided', () => {
    const realDateNow = Date.now.bind(global.Date);
    const dateNowStub = jest.fn(() => (new Date(2020, 0, 1)).getTime());
    global.Date.now = dateNowStub;

    const req = { params: { name: 'johns-island' } };
    const next = jest.fn();

    validate.getErmSonde(req, null, next);

    expect(req.query.to).toBe('2020-01-01');
    expect(next).toHaveBeenCalled();

    global.Date.now = realDateNow;
  });

  test('sets from date to one month before to date if not provided', () => {
    const req = { params: { name: 'johns-island' }, query: { to: '2020-02-01'} };
    const next = jest.fn();

    validate.getErmSonde(req, null, next);

    expect(req.query).toEqual({ from: '2020-01-01', to: '2020-02-01' });
    expect(next).toHaveBeenCalled();
  });

  test('sets to to today and from to one month ago if not provided', () => {
    const realDateNow = Date.now.bind(global.Date);
    const dateNowStub = jest.fn(() => (new Date(2020, 1, 1)).getTime());
    global.Date.now = dateNowStub;

    const req = { params: { name: 'johns-island' } };
    const next = jest.fn();

    validate.getErmSonde(req, null, next);

    expect(req.query).toEqual({ from: '2020-01-01', to: '2020-02-01' });
    expect(next).toHaveBeenCalled();

    global.Date.now = realDateNow;
  });

  test('accepts valid date range', () => {
    const req = { params: { name: 'johns-island' }, query: { from: '2020-01-01', to: '2020-02-01' } };
    const next = jest.fn();

    validate.getErmSonde(req, null, next);

  expect(req.query).toEqual({ from: '2020-01-01', to: '2020-02-01' });
  expect(next).toHaveBeenCalled();
  });
});
