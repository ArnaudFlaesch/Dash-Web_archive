import { formatDateFromTimestamp } from 'src/utils/DateUtils';

describe('DateUtils tests', () => {
  it('Should format date', () => {
    expect(formatDateFromTimestamp(1592179200).toDateString()).toEqual('Mon Jun 15 2020');
  });
});
