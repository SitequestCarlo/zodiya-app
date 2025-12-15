# PowerShell script to generate all Tarot card TSX components

$basePath = "c:\Users\crill\Documents\GitHub\zodiya-app\assets\tarot"
$outputPath = "c:\Users\crill\Documents\GitHub\zodiya-app\components\tarot\cards"

# Card mapping
$cards = @(
    @{File="03_Tarot_the-empress"; Name="TarotTheEmpress"; ViewBox="0 0 1038.34 1575.17"},
    @{File="04_Tarot_the-emperor"; Name="TarotTheEmperor"; ViewBox="0 0 1035.19 1610.73"},
    @{File="05_Tarot_the-hierophant"; Name="TarotTheHierophant"; ViewBox="0 0 976.25 1576.92"},
    @{File="06_Tarot_the-lovers"; Name="TarotTheLovers"; ViewBox="0 0 1019 1604.91"},
    @{File="07_Tarot_the-chariot"; Name="TarotTheChariot"; ViewBox="0 0 1000 1568.91"},
    @{File="08_Tarot_strength"; Name="TarotStrength"; ViewBox="0 0 1000 1573.05"},
    @{File="09_Tarot_the-hermit"; Name="TarotTheHermit"; ViewBox="0 0 1000 1570"},
    @{File="10_Tarot_wheel-of-fortune"; Name="TarotWheelOfFortune"; ViewBox="0 0 1000 1565.71"},
    @{File="11_Tarot_justice"; Name="TarotJustice"; ViewBox="0 0 1019.71 1562.66"},
    @{File="12_Tarot_the-hanged-man"; Name="TarotTheHangedMan"; ViewBox="0 0 1014.47 1575.33"},
    @{File="13_Tarot_death"; Name="TarotDeath"; ViewBox="0 0 1034 1592.76"},
    @{File="14_Tarot_temperance"; Name="TarotTemperance"; ViewBox="0 0 1021.29 1589.78"},
    @{File="15_Tarot_the-devil"; Name="TarotTheDevil"; ViewBox="0 0 998.44 1577.23"},
    @{File="16_Tarot_the-tower"; Name="TarotTheTower"; ViewBox="0 0 976.58 1570.61"},
    @{File="17_Tarot_the-star"; Name="TarotTheStar"; ViewBox="0 0 976.58 1570.61"},
    @{File="18_Tarot_the-moon"; Name="TarotTheMoon"; ViewBox="0 0 978.72 1561.53"},
    @{File="19_Tarot_the-sun"; Name="TarotTheSun"; ViewBox="0 0 976.51 1558.66"},
    @{File="20_Tarot_judgement"; Name="TarotJudgement"; ViewBox="0 0 1000 1566.79"},
    @{File="21_Tarot_the-world"; Name="TarotTheWorld"; ViewBox="0 0 1000 1566.79"}
)

foreach ($card in $cards) {
    Write-Host "Processing $($card.Name)..."
    
    # Read SVG file
    $svgPath = Join-Path $basePath "$($card.File).svg"
    $svgContent = Get-Content $svgPath -Raw
    
    # Extract the content between <g id="Ebene_2-2"> and </g></svg> using (?s) for multiline
    if ($svgContent -match '(?s)<g id="Ebene_2-2"[^>]*>(.*)</g>\s*</g>\s*</svg>') {
        $innerContent = $matches[1].Trim()
        
        # Remove inner <g> and </g> tags completely (they're just grouping, not needed)
        $innerContent = $innerContent -replace '<g>', ''
        $innerContent = $innerContent -replace '</g>', ''
        
        # Replace 'path' with 'Path' and add fill={color}
        $innerContent = $innerContent -replace '<path ', '<Path fill={color} '
        $innerContent = $innerContent -replace '</path>', '</Path>'
        $innerContent = $innerContent -replace '<rect ', '<Rect fill={color} '
        $innerContent = $innerContent -replace '<polygon ', '<Polygon fill={color} '
        $innerContent = $innerContent -replace '</polygon>', '</Polygon>'
        
        # Get viewBox dimensions
        $vbParts = $card.ViewBox -split ' '
        $width = $vbParts[2]
        $height = $vbParts[3]
        
        # Create TSX content
        $tsxContent = @"
import React from 'react';
import Svg, { G, Path, Rect, Polygon } from 'react-native-svg';

interface TarotCardProps {
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export default function $($card.Name)({
  width = 140,
  height = 222,
  color = 'black',
  backgroundColor = 'white',
}: TarotCardProps) {
  return (
    <Svg width={width} height={height} viewBox="$($card.ViewBox)" fill="none">
      <Rect x="0" y="0" width="$width" height="$height" fill={backgroundColor} />
      $innerContent
    </Svg>
  );
}
"@
        
        # Write to file
        $outputFile = Join-Path $outputPath "$($card.Name).tsx"
        $tsxContent | Out-File -FilePath $outputFile -Encoding UTF8
        Write-Host "Created $outputFile"
    } else {
        Write-Host "Failed to match regex for $($card.Name)"
    }
}

Write-Host "Done!"
