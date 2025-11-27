class TitleMask {
  paint(ctx, geom, properties) {
    // Fill whole area (mask will be clipped by the text)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, geom.width, geom.height);
  }
}

registerPaint("title-mask", TitleMask);