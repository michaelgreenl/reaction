export const warningReducer = (state, action) => {
  switch (action.type) {
    case 'startGameSettingsWarning': {
      return {
        ...state,
        startGameSettingsWarning: {
          header: 'Before Starting',
          message:
            "You haven't saved your new settings yet. Would you like to start the game with the updated settings?",
          optOutOption: null,
          buttons: [
            {
              text: 'Go Back',
              className: 'secondary',
              onClick: () => action.onClick1(),
            },
            {
              text: 'No',
              className: 'primary',
              onClick: () => action.onClick2(),
            },
            {
              text: 'Yes',
              className: 'primary',
              onClick: () => action.onClick3(),
            },
          ],
        },
      };
    }
    case 'saveGameSettingsWarning': {
      return {
        ...state,
        saveGameSettingsWarning: {
          header: 'Warning',
          message: 'Saving these settings will reset your previous scores, since the difficulty will change.',
          optOutOption: 'saveGameSettingsWarning',
          buttons: [
            {
              text: 'Cancel',
              className: 'secondary',
              onClick: () => action.onClick1(),
            },
            {
              text: 'Ok',
              className: 'primary',
              onClick: () => action.onClick2(),
            },
          ],
        },
      };
    }
    default: {
      throw Error('Unknown Warning');
    }
  }
};
