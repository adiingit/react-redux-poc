import {lightBlue700, lightBlue800, lightBlue900,
        yellowA700, orangeA400, blueGrey50, lightBlue100, darkBlack} from 'material-ui/styles/colors'

const palette = {
  primary1Color: lightBlue700,
  primary2Color: lightBlue800,
  primary3Color: lightBlue900,
  textColor: darkBlack,
  // accent1Color: '#6C6D6E',
  accent1Color: yellowA700,
  accent2Color: yellowA700,
  accentYellow: yellowA700,
  accentOrange: orangeA400,
  canvasColor: blueGrey50,
  titleColor: lightBlue100,
  iconColor: '#6C6D6E',
  white: '#FFFFFF'
}

const theme = {
  palette,
  fontFamily: 'Source Sans Pro, sans-serif',
  toolbar: {
    iconColor: darkBlack,
    backgroundColor: 'transparent'
  },
  textField: {
    focusColor: palette.accent1Color
  },
  checkbox: {
    checkedColor: palette.accent1Color,
    requiredColor: palette.accent1Color
  },
  raisedButton: {
    color: palette.accent1Color,
    textColor: palette.textColor,
    primaryColor: palette.accent1Color,
    primaryTextColor: palette.textColor
  }
}

export default theme

