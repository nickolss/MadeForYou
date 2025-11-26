package com.nickolss.madeforyou.components

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.nickolss.madeforyou.ui.theme.Emerald500
import com.nickolss.madeforyou.ui.theme.Indigo500

@Composable
fun MadeForYouLogo(modifier: Modifier = Modifier) {
    val gradientColors = listOf(Indigo500, Emerald500)

    Text(
        text = "MadeForYou",
        modifier = modifier,
        style = TextStyle(
            brush = Brush.linearGradient(colors = gradientColors),
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = (-0.5).sp
        )
    )
}