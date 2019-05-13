import gluer from '../../src/gluer';
import { gluerUniqueFlagKey, gluerUniqueFlagValue } from '../../src/constants';

describe('gluer normal test',  () => {
  test('gluer => function', () => {
    expect(gluer).toBeInstanceOf(Function);
  });

  test('gluer`s return => function', () => {
    const gr = gluer();
    expect(gr).toBeInstanceOf(Function);
  });
  test('gluer`s return => uniqueFlag', () => {
    const gr = gluer();
    expect(gr[gluerUniqueFlagKey]).toBe(gluerUniqueFlagValue);
  });

  test('gluer`s return => return => structure', () => {
    const gr = gluer();
    const result = gr();
    expect(result).toMatchObject(
      expect.objectContaining({
        reducer: expect.any(Function),
        action: expect.any(Function),
        initState: undefined
      })
    )
  });

  test('gluer`s return => return => reducer & action', () => {
    const gr = gluer();
    const result = gr();
    const mockReducer = jest.fn(result.reducer);
    mockReducer(100, {
      data: 10,
      type: 'model.js'
    });

    expect(mockReducer).toBeCalledWith(expect.anything(), {
      data: expect.anything(),
      type: expect.any(String)
    });
    expect(mockReducer).toReturnWith(10);

    const mockAction = jest.fn(result.action);
    mockAction(99);
    expect(mockAction).toBeCalledWith(expect.anything());
    expect(mockAction).toReturnWith(99);
  })
});
describe('gluer exception test', () => {
  test('when pass two arguments, but the first isn`t function', () => {
    expect(() => gluer('123', 123)).toThrow('first argument must be function');
  });
});
