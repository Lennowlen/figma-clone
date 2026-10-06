package com.figma.clone.model

import java.util.UUID

enum class ElementType {
    FRAME, RECTANGLE, ELLIPSE, TEXT, STAR, PENCIL
}

data class FigmaElement(
    val id: String = UUID.randomUUID().toString(),
    var name: String = "Layer",
    val type: ElementType = ElementType.RECTANGLE,
    var x: Float = 0f,
    var y: Float = 0f,
    var width: Float = 120f,
    var height: Float = 80f,
    var fill: String = "#3B82F6",
    var stroke: String = "#000000",
    var strokeWidth: Float = 0f,
    var cornerRadius: Float = 8f,
    var opacity: Float = 1f,
    var textContent: String = "Sample Text",
    var fontSize: Float = 16f,
    var isSelected: Boolean = false
)
