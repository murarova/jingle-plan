import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../constants/colors";

const Star = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    {...props}
  >
    <Path
      d="M8.5 0C9.775 6.375 10.625 7.225 17 8.5C10.625 9.775 9.775 10.625 8.5 17C7.225 10.625 6.375 9.775 0 8.5C6.375 7.225 7.225 6.375 8.5 0Z"
      fill={colors.progressYellow}
    />
  </Svg>
);

export default Star;
