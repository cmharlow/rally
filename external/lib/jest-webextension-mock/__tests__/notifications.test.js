describe('chrome.notifications', () => {
  test.skip('create', (done) => {
    const options = { type: 'basic' };
    const callback = jest.fn(() => done());

    expect(jest.isMockFunction(chrome.notifications.create)).toBe(true);

    chrome.notifications.create(options, callback);
    expect(chrome.notifications.create).toHaveBeenCalledTimes(1);
    expect(chrome.notifications.create).toHaveBeenLastCalledWith(
      options,
      callback
    );
    expect(callback).toHaveBeenLastCalledWith('generated-id');

    chrome.notifications.create('id', options, callback);
    expect(chrome.notifications.create).toHaveBeenCalledTimes(2);
    expect(chrome.notifications.create).toHaveBeenLastCalledWith(
      'id',
      options,
      callback
    );
    expect(callback).toHaveBeenLastCalledWith('id');
  });

  test.skip('create promise', () => {
    const options = { type: 'basic' };

    return expect(chrome.notifications.create(options)).resolves.toBe(
      'generated-id'
    );
  });

  test.skip('update', (done) => {
    const options = { type: 'basic' };
    const callback = jest.fn(() => done());

    expect(jest.isMockFunction(chrome.notifications.update)).toBe(true);
    chrome.notifications.update('id', options, callback);
    expect(chrome.notifications.update).toHaveBeenCalledTimes(1);
    expect(chrome.notifications.update).toHaveBeenLastCalledWith(
      'id',
      options,
      callback
    );
    expect(callback).toHaveBeenLastCalledWith(true);
  });

  test.skip('update promise', () => {
    const options = { type: 'basic' };

    return expect(chrome.notifications.update(options)).resolves.toBe(true);
  });

  test.skip('clear', (done) => {
    const callback = jest.fn(() => done());

    expect(jest.isMockFunction(chrome.notifications.clear)).toBe(true);
    chrome.notifications.clear('id', callback);
    expect(chrome.notifications.clear).toHaveBeenCalledTimes(1);
    expect(chrome.notifications.clear).toHaveBeenLastCalledWith('id', callback);
    expect(callback).toHaveBeenLastCalledWith(true);
  });

  test.skip('clear - promise', () => {
    return expect(chrome.notifications.clear('id')).resolves.toBe(true);
  });

  test.skip('getAll', (done) => {
    const callback = jest.fn(() => done());

    expect(jest.isMockFunction(chrome.notifications.getAll)).toBe(true);
    chrome.notifications.getAll(callback);
    expect(chrome.notifications.getAll).toHaveBeenCalledTimes(1);
    expect(chrome.notifications.getAll).toHaveBeenLastCalledWith(callback);
    expect(callback).toHaveBeenLastCalledWith([]);
  });

  test.skip('getAll - promise', () => {
    return expect(chrome.notifications.getAll()).resolves.toEqual([]);
  });

  test.skip('getPermissionLevel', (done) => {
    const callback = jest.fn(() => done());

    expect(jest.isMockFunction(chrome.notifications.getPermissionLevel)).toBe(
      true
    );
    chrome.notifications.getPermissionLevel(callback);
    expect(chrome.notifications.getPermissionLevel).toHaveBeenCalledTimes(1);
    expect(chrome.notifications.getPermissionLevel).toHaveBeenLastCalledWith(
      callback
    );
    expect(callback).toHaveBeenLastCalledWith('granted');
  });

  test.skip('getPermissionLevel - promise', () => {
    return expect(chrome.notifications.getPermissionLevel()).resolves.toEqual(
      'granted'
    );
  });

  test.skip('onClosed.addListener', () => {
    expect(jest.isMockFunction(chrome.notifications.onClosed.addListener)).toBe(
      true
    );

    chrome.notifications.onClosed.addListener(() => {});
    expect(chrome.notifications.onClosed.addListener).toHaveBeenCalledTimes(1);
  });

  test.skip('onClicked.addListener', () => {
    expect(
      jest.isMockFunction(chrome.notifications.onClicked.addListener)
    ).toBe(true);

    chrome.notifications.onClicked.addListener(() => {});
    expect(chrome.notifications.onClicked.addListener).toHaveBeenCalledTimes(1);
  });

  test.skip('onButtonClicked.addListener', () => {
    expect(
      jest.isMockFunction(chrome.notifications.onButtonClicked.addListener)
    ).toBe(true);

    chrome.notifications.onButtonClicked.addListener(() => {});
    expect(
      chrome.notifications.onButtonClicked.addListener
    ).toHaveBeenCalledTimes(1);
  });

  test.skip('onPermissionLevelChanged.addListener', () => {
    expect(
      jest.isMockFunction(
        chrome.notifications.onPermissionLevelChanged.addListener
      )
    ).toBe(true);

    chrome.notifications.onPermissionLevelChanged.addListener(() => {});
    expect(
      chrome.notifications.onPermissionLevelChanged.addListener
    ).toHaveBeenCalledTimes(1);
  });

  test.skip('onShowSettings.addListener', () => {
    expect(
      jest.isMockFunction(chrome.notifications.onShowSettings.addListener)
    ).toBe(true);

    chrome.notifications.onShowSettings.addListener(() => {});
    expect(
      chrome.notifications.onShowSettings.addListener
    ).toHaveBeenCalledTimes(1);
  });
});
