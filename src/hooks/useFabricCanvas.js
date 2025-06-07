import { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from 'fabric';
// import { Canvas, Textbox, Rect, Line, PencilBrush } from 'fabric';


export default function useFabricCanvas(tool, color = "#000000", lineWidth = 2, gridSize = 20, snapRange = 5) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const toolRef = useRef(tool);

  // Сітка
    const drawGrid = useCallback((canvas) => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    for (let i = 0; i < width; i += gridSize) {
        const line = new fabric.Line([i, 0, i, height], {
        stroke: '#eee',
        selectable: false,
        evented: false,
        excludeFromExport: true, // опціонально
        });
        canvas.add(line);
        line.sendToBack?.();// ✅ саме тут правильно
    }

    for (let j = 0; j < height; j += gridSize) {
        const line = new fabric.Line([0, j, width, j], {
        stroke: '#eee',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        });
        canvas.add(line);
        line.sendToBack?.();// ✅
    }
    }, [gridSize]);

    const snapToGrid = useCallback((value) => {
        const mod = value % gridSize;
        if (mod < snapRange) return value - mod;
        if (mod > gridSize - snapRange) return value + (gridSize - mod);
        return value;
    }, [gridSize, snapRange]);


  useEffect(() => {
    // if (fabricRef.current && typeof fabricRef.current.dispose === 'function') {
    // Promise.resolve()
    //     .then(() => fabricRef.current.dispose?.())
    //     .catch(err => {
    //     console.warn('Canvas disposal aborted:', err);
    //     });
    // }

    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: tool === "draw",
      backgroundColor: "#fefefe",
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });
    fabricRef.current = canvas;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = lineWidth;

    drawGrid(canvas);

    const handleResize = () => {
      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);
      removeGridLines(canvas);
      drawGrid(canvas);
    };

    const handleWheel = (opt) => {
      const delta = opt.e.deltaY;
      let newZoom = canvas.getZoom() * 0.999 ** delta;
      newZoom = Math.min(Math.max(newZoom, 0.5), 3);
      canvas.setZoom(newZoom);
      setZoom(newZoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    const handleMouseDown = (opt) => {
      if (opt.e.spaceKey || opt.e.which === 2) {
        canvas.isDragging = true;
        canvas.selection = false;
        canvas.lastPosX = opt.e.clientX;
        canvas.lastPosY = opt.e.clientY;
      } else {
        const pointer = opt.pointer;
        const x = snapToGrid(pointer.x);
        const y = snapToGrid(pointer.y);

        if (toolRef.current === "text") {
          const text = new fabric.Textbox("Text", {
            left: x,
            top: y,
            width: 150,
            fontSize: 20,
          });
          canvas.add(text);
          canvas.setActiveObject(text);
        } else if (toolRef.current === "rect") {
          const rect = new fabric.Rect({
            left: x,
            top: y,
            width: 100,
            height: 60,
            fill: "#ddeeff",
            stroke: color,
            strokeWidth: lineWidth,
          });
          canvas.add(rect);
          canvas.setActiveObject(rect);
        } else if (toolRef.current === "arrow") {
          const arrow = new fabric.Line([x, y, x + 60, y], {
            stroke: color,
            strokeWidth: lineWidth,
            selectable: true,
            originX: "center",
            originY: "center",
            });
            arrow.set({ hasBorders: false, hasControls: false });

            const head = new fabric.Triangle({
            left: x + 60,
            top: y,
            originX: 'center',
            originY: 'center',
            angle: 90,
            width: 10,
            height: 10,
            fill: color,
            });

            const group = new fabric.Group([arrow, head], {
            selectable: true,
            });

            canvas.add(group);
        }
      }
    };

    const handleMouseMove = (opt) => {
      if (canvas.isDragging) {
        const e = opt.e;
        const vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - canvas.lastPosX;
        vpt[5] += e.clientY - canvas.lastPosY;
        canvas.requestRenderAll();
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      canvas.setViewportTransform(canvas.viewportTransform);
      canvas.isDragging = false;
      canvas.selection = true;
    };

    canvas.on("mouse:wheel", handleWheel);
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("object:moving", (opt) => {
    const obj = opt.target;
        if (obj) {
            const left = obj.left ?? 0;
            const top = obj.top ?? 0;
            obj.set({
            left: snapToGrid(left),
            top: snapToGrid(top)
            });
            obj.setCoords();
        }
    });


    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
        try {
            fabricRef.current?.dispose?.();
        } catch (e) {
            console.warn("Canvas dispose failed in cleanup:", e);
        }
    };
  }, [tool, color, lineWidth, drawGrid, snapToGrid]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = lineWidth;
    }
  }, [color, lineWidth]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.isDrawingMode = tool === "draw";
    }
    toolRef.current = tool;
  }, [tool]);

    const handleUndo = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        for (let i = canvas._objects.length - 1; i >= 0; i--) {
            if (canvas._objects[i].selectable) {
            canvas._objects.splice(i, 1);
            break;
            }
        }
        canvas.renderAll();
    };

  const handleClear = () => {
    const canvas = fabricRef.current;
    canvas.clear();
    canvas.backgroundColor = "#fefefe";
    drawGrid(canvas);
    canvas.renderAll();
  };

  const setCurrentTool = (tool) => {
    toolRef.current = tool;
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = tool === "draw";
    }
  };

  const setDrawingStyle = (newColor, newWidth) => {
    const canvas = fabricRef.current;
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = newColor;
      canvas.freeDrawingBrush.width = newWidth;
    }
  };

  const removeGridLines = (canvas) => {
    const objectsToRemove = canvas.getObjects().filter(obj =>
        obj.stroke === '#eee' && !obj.selectable && !obj.evented
    );
    objectsToRemove.forEach(obj => canvas.remove(obj));
  };

  return {
    canvasRef,
    zoom,
    handleUndo,
    handleClear,
    setCurrentTool,
    setDrawingStyle,
  };
}
