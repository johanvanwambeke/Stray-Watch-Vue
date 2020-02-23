<template>
  <div>
    <v-btn @click="doit">click</v-btn>
    <canvas id="ogimg" ref="ogimg" height="315" width="600"></canvas>
  </div>
</template>
<script>
export default {
  methods: {
    doit() {
      self = this
      var canvas = this.$refs['ogimg']
      canvas.width = canvas.scrollWidth
      canvas.height = canvas.scrollHeight
      var ctx = canvas.getContext('2d')
      var image = new Image()
      image.onload = function() {
        self.drawImageProp(
          ctx,
          image,
          canvas.width / 2.2,
          0,
          canvas.width / 1.8,
          canvas.height
        )
        //achtergrond
        ctx.fillStyle = '#000000'
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(canvas.width / 2.2, 0)
        ctx.lineTo(canvas.width / 2, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.fill()
        //text
        ctx.font = '30px Arial'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('Hello World', 10, 50)
        ctx.fillText('This dog is happy', 10, 100)
        ctx.fillText('It is a good dog', 10, 150)
      }
      image.src =
        'https://straywatchfotos.blob.core.windows.net/animalfotos/db225ba3-6e3a-4747-a121-6582e3c9d98b.png'
    },
    drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
      if (arguments.length === 2) {
        x = y = 0
        w = ctx.canvas.width
        h = ctx.canvas.height
      }

      // default offset is center
      offsetX = typeof offsetX === 'number' ? offsetX : 0.5
      offsetY = typeof offsetY === 'number' ? offsetY : 0.5

      // keep bounds [0.0, 1.0]
      if (offsetX < 0) offsetX = 0
      if (offsetY < 0) offsetY = 0
      if (offsetX > 1) offsetX = 1
      if (offsetY > 1) offsetY = 1

      var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, // new prop. width
        nh = ih * r, // new prop. height
        cx,
        cy,
        cw,
        ch,
        ar = 1

      // decide which gap to fill
      if (nw < w) ar = w / nw
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh // updated
      nw *= ar
      nh *= ar

      // calc source rectangle
      cw = iw / (nw / w)
      ch = ih / (nh / h)

      cx = (iw - cw) * offsetX
      cy = (ih - ch) * offsetY

      // make sure source rectangle is valid
      if (cx < 0) cx = 0
      if (cy < 0) cy = 0
      if (cw > iw) cw = iw
      if (ch > ih) ch = ih

      // fill image in dest. rectangle
      ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
    }
  }
}
</script>
