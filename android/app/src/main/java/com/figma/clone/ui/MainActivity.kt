package com.figma.clone.ui

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.doAfterTextChanged
import com.figma.clone.databinding.ActivityMainBinding
import com.figma.clone.model.ElementType
import com.figma.clone.model.FigmaElement
import com.google.gson.GsonBuilder

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val toolButtons = mutableListOf<ImageButton>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initDefaultDesign()
        setupToolbar()
        setupInspector()
    }

    private fun initDefaultDesign() {
        val initialElements = listOf(
            FigmaElement(
                name = "Frame 1 (Mobile)",
                type = ElementType.FRAME,
                x = 60f,
                y = 80f,
                width = 300f,
                height = 500f,
                cornerRadius = 24f,
                fill = "#27272A"
            ),
            FigmaElement(
                name = "Header Banner",
                type = ElementType.RECTANGLE,
                x = 80f,
                y = 100f,
                width = 260f,
                height = 120f,
                cornerRadius = 16f,
                fill = "#0C8CE9"
            ),
            FigmaElement(
                name = "Studio Title",
                type = ElementType.TEXT,
                x = 100f,
                y = 140f,
                width = 220f,
                height = 40f,
                textContent = "Figma UI3 Native",
                fontSize = 20f,
                fill = "#FFFFFF"
            ),
            FigmaElement(
                name = "Action Button",
                type = ElementType.RECTANGLE,
                x = 80f,
                y = 480f,
                width = 260f,
                height = 54f,
                cornerRadius = 12f,
                fill = "#10B981"
            )
        )
        binding.canvasView.setElements(initialElements)
    }

    private fun setupToolbar() {
        toolButtons.addAll(
            listOf(
                binding.toolSelect,
                binding.toolFrame,
                binding.toolRectangle,
                binding.toolEllipse,
                binding.toolText,
                binding.toolStar
            )
        )

        binding.toolSelect.setOnClickListener {
            setActiveTool(null, binding.toolSelect)
        }
        binding.toolFrame.setOnClickListener {
            setActiveTool(ElementType.FRAME, binding.toolFrame)
        }
        binding.toolRectangle.setOnClickListener {
            setActiveTool(ElementType.RECTANGLE, binding.toolRectangle)
        }
        binding.toolEllipse.setOnClickListener {
            setActiveTool(ElementType.ELLIPSE, binding.toolEllipse)
        }
        binding.toolText.setOnClickListener {
            setActiveTool(ElementType.TEXT, binding.toolText)
        }
        binding.toolStar.setOnClickListener {
            setActiveTool(ElementType.STAR, binding.toolStar)
        }

        binding.btnExport.setOnClickListener {
            val elements = binding.canvasView.getElements()
            val gson = GsonBuilder().setPrettyPrinting().create()
            val json = gson.toJson(elements)
            Toast.makeText(this, "Exported ${elements.size} layers to Figma JSON format!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setActiveTool(tool: ElementType?, activeButton: ImageButton) {
        binding.canvasView.currentTool = tool
        for (btn in toolButtons) {
            btn.imageTintList = ColorStateList.valueOf(Color.parseColor("#A1A1AA"))
        }
        activeButton.imageTintList = ColorStateList.valueOf(Color.parseColor("#0C8CE9"))
        if (tool != null) {
            Toast.makeText(this, "Tap on canvas to place ${tool.name.lowercase()}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupInspector() {
        binding.canvasView.onElementSelected = { el ->
            if (el != null) {
                binding.inspectorPanel.visibility = View.VISIBLE
                binding.tvSelectedName.text = el.name
                binding.etWidth.setText(el.width.toInt().toString())
                binding.etHeight.setText(el.height.toInt().toString())
                binding.etRadius.setText(el.cornerRadius.toInt().toString())
            } else {
                binding.inspectorPanel.visibility = View.GONE
            }
        }

        binding.canvasView.onCanvasChanged = {
            binding.canvasView.getSelectedElement()?.let { el ->
                binding.etWidth.setText(el.width.toInt().toString())
                binding.etHeight.setText(el.height.toInt().toString())
            }
        }

        binding.btnDelete.setOnClickListener {
            binding.canvasView.deleteSelected()
        }

        binding.etWidth.doAfterTextChanged {
            val w = it.toString().toFloatOrNull()
            binding.canvasView.getSelectedElement()?.let { el ->
                if (w != null && w > 0) {
                    el.width = w
                    binding.canvasView.invalidate()
                }
            }
        }

        binding.etHeight.doAfterTextChanged {
            val h = it.toString().toFloatOrNull()
            binding.canvasView.getSelectedElement()?.let { el ->
                if (h != null && h > 0) {
                    el.height = h
                    binding.canvasView.invalidate()
                }
            }
        }

        binding.etRadius.doAfterTextChanged {
            val r = it.toString().toFloatOrNull()
            binding.canvasView.getSelectedElement()?.let { el ->
                if (r != null && r >= 0) {
                    el.cornerRadius = r
                    binding.canvasView.invalidate()
                }
            }
        }

        // Color Swatches
        val colorPairs = listOf(
            binding.colorBlue to "#0C8CE9",
            binding.colorPurple to "#8B5CF6",
            binding.colorGreen to "#10B981",
            binding.colorRed to "#EF4444",
            binding.colorDark to "#27272A",
            binding.colorWhite to "#FFFFFF"
        )
        for ((view, color) in colorPairs) {
            view.setOnClickListener {
                binding.canvasView.getSelectedElement()?.let { el ->
                    el.fill = color
                    binding.canvasView.invalidate()
                }
            }
        }
    }
}
