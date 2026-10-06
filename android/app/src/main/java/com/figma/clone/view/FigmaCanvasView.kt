package com.figma.clone.view

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.GestureDetector
import android.view.MotionEvent
import android.view.ScaleGestureDetector
import android.view.View
import com.figma.clone.model.ElementType
import com.figma.clone.model.FigmaElement

class FigmaCanvasView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val elements = mutableListOf<FigmaElement>()
    var onElementSelected: ((FigmaElement?) -> Unit)? = null
    var onCanvasChanged: (() -> Unit)? = null

    var currentTool: ElementType? = null

    // Transformation / Infinite Canvas Pan & Zoom
    var scaleFactor = 1.0f
    var panX = 0f
    var panY = 0f

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
    }
    private val selectionPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        color = Color.parseColor("#0C8CE9")
        strokeWidth = 3f
    }
    private val gridPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#26262B")
        strokeWidth = 1f
    }

    private var activeElement: FigmaElement? = null
    private var isDragging = false
    private var lastTouchX = 0f
    private var lastTouchY = 0f

    private val scaleDetector = ScaleGestureDetector(context, object : ScaleGestureDetector.SimpleOnScaleGestureListener() {
        override fun onScale(detector: ScaleGestureDetector): Boolean {
            scaleFactor *= detector.scaleFactor
            scaleFactor = scaleFactor.coerceIn(0.1f, 5.0f)
            invalidate()
            return true
        }
    })

    fun setElements(list: List<FigmaElement>) {
        elements.clear()
        elements.addAll(list)
        invalidate()
    }

    fun getElements(): List<FigmaElement> = elements

    fun addElement(element: FigmaElement) {
        elements.forEach { it.isSelected = false }
        element.isSelected = true
        elements.add(element)
        activeElement = element
        onElementSelected?.invoke(element)
        onCanvasChanged?.invoke()
        invalidate()
    }

    fun deleteSelected() {
        activeElement?.let {
            elements.remove(it)
            activeElement = null
            onElementSelected?.invoke(null)
            onCanvasChanged?.invoke()
            invalidate()
        }
    }

    fun getSelectedElement(): FigmaElement? = activeElement

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        // Draw Canvas Background
        canvas.drawColor(Color.parseColor("#18181B"))

        canvas.save()
        canvas.translate(panX, panY)
        canvas.scale(scaleFactor, scaleFactor)

        // Draw Dot/Pixel Grid
        val gridSize = 40f
        val left = -panX / scaleFactor - 100f
        val top = -panY / scaleFactor - 100f
        val right = left + width / scaleFactor + 200f
        val bottom = top + height / scaleFactor + 200f

        var x = (left - (left % gridSize))
        while (x < right) {
            var y = (top - (top % gridSize))
            while (y < bottom) {
                canvas.drawCircle(x, y, 1.5f, gridPaint)
                y += gridSize
            }
            x += gridSize
        }

        // Draw Elements
        for (el in elements) {
            val color = try {
                Color.parseColor(el.fill)
            } catch (e: Exception) {
                Color.WHITE
            }
            paint.color = color
            paint.style = Paint.Style.FILL

            when (el.type) {
                ElementType.FRAME -> {
                    paint.color = Color.parseColor("#27272A")
                    val rect = RectF(el.x, el.y, el.x + el.width, el.y + el.height)
                    canvas.drawRoundRect(rect, el.cornerRadius, el.cornerRadius, paint)
                    // Draw Frame Label
                    val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
                        this.color = Color.parseColor("#A1A1AA")
                        textSize = 12f
                    }
                    canvas.drawText(el.name, el.x, el.y - 6f, textPaint)
                }
                ElementType.RECTANGLE -> {
                    val rect = RectF(el.x, el.y, el.x + el.width, el.y + el.height)
                    canvas.drawRoundRect(rect, el.cornerRadius, el.cornerRadius, paint)
                }
                ElementType.ELLIPSE -> {
                    val rect = RectF(el.x, el.y, el.x + el.width, el.y + el.height)
                    canvas.drawOval(rect, paint)
                }
                ElementType.TEXT -> {
                    paint.textSize = el.fontSize
                    paint.color = try { Color.parseColor(el.fill) } catch (e: Exception) { Color.WHITE }
                    canvas.drawText(el.textContent, el.x, el.y + el.fontSize, paint)
                }
                ElementType.STAR -> {
                    val rect = RectF(el.x, el.y, el.x + el.width, el.y + el.height)
                    canvas.drawRoundRect(rect, el.cornerRadius, el.cornerRadius, paint)
                }
                ElementType.PENCIL -> {
                    val rect = RectF(el.x, el.y, el.x + el.width, el.y + el.height)
                    canvas.drawRoundRect(rect, 4f, 4f, paint)
                }
            }

            // Draw selection box & corner handles
            if (el.isSelected) {
                val selRect = RectF(el.x - 2f, el.y - 2f, el.x + el.width + 2f, el.y + el.height + 2f)
                canvas.drawRect(selRect, selectionPaint)

                // Corner Handles
                val handlePaint = Paint(Paint.ANTI_ALIAS_FLAG)
                handlePaint.color = Color.WHITE
                handlePaint.style = Paint.Style.FILL
                val handleStroke = Paint(Paint.ANTI_ALIAS_FLAG)
                handleStroke.color = Color.parseColor("#0C8CE9")
                handleStroke.style = Paint.Style.STROKE
                handleStroke.strokeWidth = 2f
                val handleSize = 6f
                val corners = arrayOf(
                    PointF(selRect.left, selRect.top),
                    PointF(selRect.right, selRect.top),
                    PointF(selRect.right, selRect.bottom),
                    PointF(selRect.left, selRect.bottom)
                )
                for (c in corners) {
                    canvas.drawRect(c.x - handleSize / 2, c.y - handleSize / 2, c.x + handleSize / 2, c.y + handleSize / 2, handlePaint)
                    canvas.drawRect(c.x - handleSize / 2, c.y - handleSize / 2, c.x + handleSize / 2, c.y + handleSize / 2, handleStroke)
                }
            }
        }

        canvas.restore()
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        scaleDetector.onTouchEvent(event)

        val canvasX = (event.x - panX) / scaleFactor
        val canvasY = (event.y - panY) / scaleFactor

        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                lastTouchX = event.x
                lastTouchY = event.y

                if (currentTool != null) {
                    val newEl = FigmaElement(
                        name = currentTool!!.name.lowercase().replaceFirstChar { it.uppercase() },
                        type = currentTool!!,
                        x = canvasX,
                        y = canvasY,
                        width = if (currentTool == ElementType.TEXT) 140f else 120f,
                        height = if (currentTool == ElementType.TEXT) 30f else 80f,
                        fill = when (currentTool) {
                            ElementType.FRAME -> "#27272A"
                            ElementType.TEXT -> "#FFFFFF"
                            else -> "#0C8CE9"
                        }
                    )
                    addElement(newEl)
                    currentTool = null
                    return true
                }

                // Check hit test for selection (reverse order for top-most)
                var hit: FigmaElement? = null
                for (i in elements.indices.reversed()) {
                    val el = elements[i]
                    if (canvasX >= el.x && canvasX <= el.x + el.width &&
                        canvasY >= el.y && canvasY <= el.y + el.height) {
                        hit = el
                        break
                    }
                }

                elements.forEach { it.isSelected = false }
                if (hit != null) {
                    hit.isSelected = true
                    activeElement = hit
                    isDragging = true
                    onElementSelected?.invoke(hit)
                } else {
                    activeElement = null
                    isDragging = false
                    onElementSelected?.invoke(null)
                }
                invalidate()
                return true
            }

            MotionEvent.ACTION_MOVE -> {
                val dx = (event.x - lastTouchX)
                val dy = (event.y - lastTouchY)

                if (isDragging && activeElement != null && event.pointerCount == 1) {
                    activeElement?.let {
                        it.x += dx / scaleFactor
                        it.y += dy / scaleFactor
                        onCanvasChanged?.invoke()
                    }
                } else if (event.pointerCount > 1 || (!isDragging && activeElement == null)) {
                    // Pan Canvas
                    panX += dx
                    panY += dy
                }

                lastTouchX = event.x
                lastTouchY = event.y
                invalidate()
                return true
            }

            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                isDragging = false
                return true
            }
        }

        return super.onTouchEvent(event)
    }
}
