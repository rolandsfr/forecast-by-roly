import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const hasDrawn = useRef(false);

  const draw = (ctx, h, w) => {
    // Define the points as {x, y}
    let start = { x: 0, y: 10 };
    let cp1 = { x: w / 4, y: 0 };
    let cp2 = { x: w - w / 2, y: 70 };
    let end = { x: w - 50, y: h - 50 };

    // Cubic Bézier curve
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);

    // setting stroke to the gradient
    let gradient = ctx.createLinearGradient(20, 0, 220, 0);

    // Add three color stops
    gradient.addColorStop(0, "#fc9526");
    gradient.addColorStop(0.2, "#ffed99");
    gradient.addColorStop(1, "#fff");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0.2;

    ctx.stroke();

    hasDrawn.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const [height, width] = [props.height, canvas.offsetWidth];

    //drawing the bezier curve
    if (!hasDrawn.current) draw(context, height, width);
  }, [draw]);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
