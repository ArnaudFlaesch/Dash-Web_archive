import { formatDateFromTimestamp } from 'src/utils/DateUtils';

describe('DateUtils tests', () => {
  it('Should format date', () => {
    expect(formatDateFromTimestamp(1592179200).toLocaleString()).toEqual(
      '15/06/2020, 02:00:00'
    );
  });
});
