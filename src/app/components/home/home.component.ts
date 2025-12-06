import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from "../../../../node_modules/@angular/common/index";
import { CommonModule } from '@angular/common';   // << IMPORT CORRECTO

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit{
  @ViewChild('mapImage', { static: true }) mapImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('overlayCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // Lista de polígonos procesados desde <area>
  private polygons: Array<{ id: string; title: string; coords: number[] }> = [];

  private ctx!: CanvasRenderingContext2D | null;
  private scaleX = 1;
  private scaleY = 1;

  // Tooltip state
  tooltipVisible = false;
  tooltipText = '';
  tooltipX = 0;
  tooltipY = 0;

  constructor(private elementRef: ElementRef, private router: Router) {}

  ngAfterViewInit(): void {
    this.parseAreas();

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    canvas.addEventListener('mousemove', this.onCanvasMouseMove);
    canvas.addEventListener('mouseleave', this.onCanvasMouseLeave);
    canvas.addEventListener('click', this.onCanvasClick);

    if (this.mapImageRef.nativeElement.complete) {
      this.onImageLoad();
    }

    window.addEventListener('resize', () => this.onImageLoad());
  }

  private parseAreas(): void {
    const areaList = this.elementRef.nativeElement.querySelectorAll(
      '#image-map-angular area'
    ) as NodeListOf<HTMLAreaElement>;

    this.polygons = [];

    areaList.forEach((area: HTMLAreaElement) => {
      const coordsAttr = area.getAttribute('coords');
      const deptId =
        area.getAttribute('data-department') ||
        area.getAttribute('href') ||
        area.getAttribute('title') ||
        'dep';

      const title = area.getAttribute('title') || deptId;

      if (!coordsAttr) return;

      const nums = coordsAttr
        .split(',')
        .map((s: string) => parseFloat(s.trim()))
        .filter((n: number) => !isNaN(n));

      if (nums.length >= 6) {
        this.polygons.push({ id: deptId, title, coords: nums });
      }
    });
  }

  public onImageLoad(): void {
    const img = this.mapImageRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    const clientW = img.clientWidth;
    const clientH = img.clientHeight;

    const naturalW = img.naturalWidth || clientW;
    const naturalH = img.naturalHeight || clientH;

    this.scaleX = clientW / naturalW;
    this.scaleY = clientH / naturalH;

    canvas.width = clientW;
    canvas.height = clientH;
    canvas.style.width = clientW + 'px';
    canvas.style.height = clientH + 'px';
    canvas.style.left = img.offsetLeft + 'px';
    canvas.style.top = img.offsetTop + 'px';

    this.clearCanvas();
  }

  private getScaledPolygon(coords: number[]): number[] {
    const scaled: number[] = [];
    for (let i = 0; i < coords.length; i += 2) {
      scaled.push(coords[i] * this.scaleX);
      scaled.push(coords[i + 1] * this.scaleY);
    }
    return scaled;
  }

  private drawHighlight(scaledCoords: number[]): void {
    if (!this.ctx) return;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    ctx.beginPath();
    ctx.moveTo(scaledCoords[0], scaledCoords[1]);
    for (let i = 2; i < scaledCoords.length; i += 2) {
      ctx.lineTo(scaledCoords[i], scaledCoords[i + 1]);
    }
    ctx.closePath();

    ctx.fillStyle = 'rgba(255,170,0,0.35)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,170,0,0.95)';
    ctx.stroke();
  }

  private clearCanvas(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  private onCanvasMouseMove = (ev: MouseEvent): void => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    const found = this.polygons.find((p) => {
      const scaled = this.getScaledPolygon(p.coords);
      return this.pointInPolygon(x, y, scaled);
    });

    if (found) {
      const scaled = this.getScaledPolygon(found.coords);
      this.drawHighlight(scaled);

      this.tooltipVisible = true;
      this.tooltipText = found.title;

      this.tooltipX = ev.clientX;
      this.tooltipY = ev.clientY;
    } else {
      this.clearCanvas();
      this.tooltipVisible = false;
    }
  };

  private onCanvasMouseLeave = (): void => {
    this.clearCanvas();
    this.tooltipVisible = false;
  };

  private onCanvasClick = (ev: MouseEvent): void => {
  const rect = this.canvasRef.nativeElement.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  const found = this.polygons.find((p) =>
    this.pointInPolygon(x, y, this.getScaledPolygon(p.coords))
  );

  if (found) {
    const dept = found.title; // EJ: "Loreto"

    this.router.navigate(
      ['/talleres'],
      { queryParams: { departamento: dept } }  // ← ENVÍO DEL NOMBRE EXACTO DEL TITLE
    );
  }
};

  private pointInPolygon(x: number, y: number, scaledCoords: number[]): boolean {
    let inside = false;

    const len = scaledCoords.length / 2;
    for (let i = 0, j = len - 1; i < len; j = i++) {
      const xi = scaledCoords[2 * i],
        yi = scaledCoords[2 * i + 1];
      const xj = scaledCoords[2 * j],
        yj = scaledCoords[2 * j + 1];

      const intersect =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / ((yj - yi) + 1e-7) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }
}
