import * as React from "react";
import {
  // generateCurvePath,
  // generateRightAnglePath,
  // generateSmartPath,
  IConfig,
  ILink,
  IOnLinkClick,
  IOnLinkMouseEnter,
  IOnLinkMouseLeave,
  IPort,
  IPosition,
} from "../../";
//@ts-ignore
import LeaderLine from "../leaderline";

export interface ILinkDefaultProps {
  config: IConfig;
  link: ILink;
  startPos: IPosition;
  endPos: IPosition;
  fromPort: IPort;
  toPort?: IPort;
  onLinkMouseEnter: IOnLinkMouseEnter;
  onLinkMouseLeave: IOnLinkMouseLeave;
  onLinkClick: IOnLinkClick;
  isHovered: boolean;
  isSelected: boolean;
  matrix?: number[][];
}

export const LinkDefault = ({
  config,
  link,
  startPos,
  endPos,
  fromPort,
  toPort,
  onLinkMouseEnter,
  onLinkMouseLeave,
  onLinkClick,
  isHovered,
  isSelected,
  matrix,
}: ILinkDefaultProps) => {
  // const points = config.smartRouting
  //   ? !!toPort && !!matrix
  //     ? generateSmartPath(matrix, startPos, endPos, fromPort, toPort)
  //     : generateRightAnglePath(startPos, endPos)
  //   : generateCurvePath(startPos, endPos);

  const linkColor: string =
    (fromPort.properties && fromPort.properties.linkColor) || "cornflowerblue";

  const startRef = React.useRef<any>();
  const endRef = React.useRef<any>();
  const lineRef = React.useRef<any>();
  //@ts-ignore

  const line = React.useMemo(() => {
    if (!startRef.current) return;
    const line = new LeaderLine(startRef.current, endRef.current);
    line.setOptions({ startSocket: "right", endSocket: "left" });
    line.color = linkColor;
    line.startPlug = "none";
    line.endPlug = "behind";
    line.path = "line";
    lineRef.current = line;
    return line;
  }, [startRef.current]);

  React.useEffect(() => {
    if (!lineRef.current) return;
    lineRef.current.position();
    if (!toPort) {
      lineRef.current.setOptions({ dash: { animation: true } });
    } else {
      lineRef.current.setOptions({  dash : false});
    }
  }, [startPos, endPos, toPort]);

  React.useEffect(() => {
    return () => {
      if (lineRef.current) {
        lineRef.current.remove();
      }
    };
  }, []);
  return (
    <svg
      style={{
        overflow: "visible",
        position: "absolute",
        cursor: "pointer",
        left: 0,
        right: 0,
      }}
    >
      <circle
        r="4"
        cx={startPos.x}
        cy={startPos.y}
        fill={linkColor}
        ref={startRef}
      />
      {/* Main line */}
      {/* <path d={points} stroke={linkColor} strokeWidth="3" fill="none" /> */}
      {/* Thick line to make selection easier */}
      {/* <path
        d={points}
        stroke={linkColor}
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeOpacity={isHovered || isSelected ? 0.1 : 0}
        onMouseEnter={() => onLinkMouseEnter({ config, linkId: link.id })}
        onMouseLeave={() => onLinkMouseLeave({ config, linkId: link.id })}
        onClick={(e) => {
          onLinkClick({ config, linkId: link.id });
          e.stopPropagation();
        }}
      /> */}
      <circle r="4" cx={endPos.x} cy={endPos.y} fill={linkColor} ref={endRef} />
    </svg>
  );
};
