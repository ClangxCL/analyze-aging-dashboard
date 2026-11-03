# -*- coding: utf-8 -*-
import os
import re
import html

def slugify(text):
    text = re.sub(r'[\(\):\.\,\/\&\+\=\?\!\@\#\$\%\^\*\'\"]', '', text)
    text = re.sub(r'[\s_–—]+', '-', text.strip())
    return text.lower()

def convert_inline(text):
    # Escape HTML characters first, except if already contains tags like <br>
    text = text.replace("<br>", "__BR_TAG__").replace("<br/>", "__BR_TAG__")
    
    # Process links: [text](#anchor)
    # Also standardize anchors so Thai slugs connect properly
    def link_repl(m):
        label = m.group(1)
        target = m.group(2)
        # Normalize double dash to single dash in internal anchor
        if target.startswith('#'):
            target_slug = target[1:].replace('--', '-')
            return f'<a href="#{target_slug}">{label}</a>'
        return f'<a href="{target}">{label}</a>'
        
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link_repl, text)
    
    # Process code: `code`
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    
    # Process bold: **text**
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    
    # Process italic: *text*
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
    
    # Restore <br>
    text = text.replace("__BR_TAG__", "<br>")
    
    # Beautify 43-file names with badges
    badge_map = {
        'แฟ้ม PERSON': '<span class="badge-file badge-person">แฟ้ม PERSON</span>',
        'แฟ้ม HOME': '<span class="badge-file badge-home">แฟ้ม HOME</span>',
        'แฟ้ม DEATH': '<span class="badge-file badge-death">แฟ้ม DEATH</span>',
        'แฟ้ม SPECIAL PP': '<span class="badge-file badge-specialpp">แฟ้ม SPECIAL PP</span>',
        'แฟ้ม DIAGNOSIS_OPD': '<span class="badge-file badge-diag">แฟ้ม DIAGNOSIS_OPD</span>',
        'แฟ้ม DIAGNOSIS_IPD': '<span class="badge-file badge-diag">แฟ้ม DIAGNOSIS_IPD</span>',
        'แฟ้ม DENTAL': '<span class="badge-file badge-dental">แฟ้ม DENTAL</span>',
        'แฟ้ม NCDSCREEN': '<span class="badge-file badge-ncd">แฟ้ม NCDSCREEN</span>',
        'แฟ้ม CHRONIC_FU': '<span class="badge-file badge-chronic">แฟ้ม CHRONIC_FU</span>',
        'แฟ้ม CHRONIC': '<span class="badge-file badge-chronic">แฟ้ม CHRONIC</span>',
        'แฟ้ม LABFU': '<span class="badge-file badge-lab">แฟ้ม LABFU</span>',
        'แฟ้ม PROCEDURE_OPD': '<span class="badge-file badge-proc">แฟ้ม PROCEDURE_OPD</span>',
    }
    for file_name, badge_html in badge_map.items():
        text = text.replace(file_name, badge_html)
        
    return text

def parse_markdown_to_html(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    lines = raw_text.splitlines()
    html_parts = []
    
    in_table = False
    table_header = None
    table_rows = []
    
    in_list = False
    list_type = None # 'ul' or 'ol'
    
    def flush_table():
        nonlocal in_table, table_header, table_rows
        if not in_table:
            return
        
        is_matrix = table_header and len(table_header) >= 7
        table_class = "data-table matrix-table" if is_matrix else "data-table spec-table"
        
        t_html = [f'<div class="table-responsive"><table class="{table_class}">']
        if table_header:
            t_html.append('<thead><tr>')
            for col in table_header:
                t_html.append(f'<th>{convert_inline(col)}</th>')
            t_html.append('</tr></thead>')
        
        t_html.append('<tbody>')
        for row in table_rows:
            t_html.append('<tr>')
            for idx, col in enumerate(row):
                is_condition = (idx == len(row) - 1)
                td_class = ' class="col-condition"' if is_condition else ''
                t_html.append(f'<td{td_class}>{convert_inline(col)}</td>')
            t_html.append('</tr>')
        t_html.append('</tbody></table></div>')
        html_parts.append('\n'.join(t_html))
        
        in_table = False
        table_header = None
        table_rows = []

    def flush_list():
        nonlocal in_list, list_type
        if not in_list:
            return
        html_parts.append(f'</{list_type}>')
        in_list = False
        list_type = None

    for line in lines:
        stripped = line.strip()
        
        # Check Table
        if stripped.startswith('|'):
            flush_list()
            cols = [c.strip() for c in stripped.split('|')[1:-1]]
            if not in_table:
                in_table = True
                table_header = cols
                table_rows = []
            else:
                if all(re.match(r'^:?-+:?$', c) for c in cols):
                    continue
                table_rows.append(cols)
            continue
        else:
            if in_table:
                flush_table()

        # Check Empty line
        if not stripped:
            flush_list()
            continue

        # Check Horizontal Rule
        if stripped in ('---', '***', '___'):
            flush_list()
            html_parts.append('<hr class="divider">')
            continue

        # Check Headers
        if stripped.startswith('#'):
            flush_list()
            h_match = re.match(r'^(#{1,6})\s+(.*)$', stripped)
            if h_match:
                level = len(h_match.group(1))
                h_text = h_match.group(2)
                h_id = slugify(h_text)
                
                # Check for main parts
                if level == 1 and 'ส่วนที่' in h_text:
                    html_parts.append(f'<div class="section-card"><h1 id="{h_id}" class="section-title">{convert_inline(h_text)}</h1>')
                elif level == 1:
                    html_parts.append(f'<h1 id="{h_id}">{convert_inline(h_text)}</h1>')
                elif level == 2 and re.match(r'^\d+\.', h_text):
                    num_part = h_text.split('.')[0]
                    rest_part = h_text.split('.', 1)[1]
                    html_parts.append(f'<div class="dataset-card" id="{h_id}"><h2 class="dataset-header"><span class="h-num">{num_part}</span> {convert_inline(rest_part)}</h2>')
                elif level == 2:
                    html_parts.append(f'<h2 id="{h_id}">{convert_inline(h_text)}</h2>')
                elif level == 3:
                    html_parts.append(f'<h3 id="{h_id}">{convert_inline(h_text)}</h3>')
                else:
                    html_parts.append(f'<h{level} id="{h_id}">{convert_inline(h_text)}</h{level}>')
                continue

        # Check Unordered list
        if stripped.startswith('* ') or stripped.startswith('- '):
            if not in_list or list_type != 'ul':
                flush_list()
                in_list = True
                list_type = 'ul'
                html_parts.append('<ul class="list-bullet">')
            item_text = stripped[2:]
            html_parts.append(f'<li>{convert_inline(item_text)}</li>')
            continue

        # Check Ordered list
        ol_match = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if ol_match:
            if not in_list or list_type != 'ol':
                flush_list()
                in_list = True
                list_type = 'ol'
                html_parts.append('<ol class="list-number">')
            item_text = ol_match.group(2)
            html_parts.append(f'<li>{convert_inline(item_text)}</li>')
            continue

        # Regular Paragraph
        flush_list()
        html_parts.append(f'<p>{convert_inline(stripped)}</p>')

    flush_table()
    flush_list()
    
    return '\n'.join(html_parts)

def build_full_html():
    md_path = "c:/Users/Piyanut/Desktop/Code_Work/docs/Elderly_Health_Dataset_Specification_and_Conditions_V2.md"
    body_content = parse_markdown_to_html(md_path)
    
    html_template = f"""<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ชุดข้อมูลที่เกี่ยวข้องด้านสุขภาพผู้สูงอายุ และขั้นตอนการดูแลรักษา (Data Set & Care Pathways V2)</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {{
            --primary: #0f3959;
            --primary-dark: #0a253a;
            --primary-light: #1e5a8a;
            --secondary: #0d9488;
            --secondary-dark: #0f766e;
            --accent: #d97706;
            --bg-body: #f8fafc;
            --bg-card: #ffffff;
            --text-main: #0f172a;
            --text-muted: #475569;
            --border: #cbd5e1;
            --border-light: #e2e8f0;
            --condition-bg: #f0fdf4;
            --condition-border: #86efac;
            --condition-text: #14532d;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}

        html {{
            scroll-behavior: smooth;
        }}

        body {{
            font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg-body);
            color: var(--text-main);
            line-height: 1.68;
            font-size: 15px;
            padding-bottom: 70px;
        }}

        /* Header Banner */
        .hero-banner {{
            background: linear-gradient(135deg, #0b253a 0%, #0f3959 50%, #0f766e 100%);
            color: #ffffff;
            padding: 44px 24px;
            box-shadow: var(--shadow-lg);
            margin-bottom: 20px;
            border-bottom: 4px solid var(--secondary);
        }}

        .hero-container {{
            max-width: 1440px;
            margin: 0 auto;
        }}

        .hero-tag {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.16);
            border: 1px solid rgba(255, 255, 255, 0.28);
            color: #f8fafc;
            font-size: 13px;
            font-weight: 600;
            padding: 4px 14px;
            border-radius: 9999px;
            margin-bottom: 14px;
            letter-spacing: 0.5px;
        }}

        .hero-title {{
            font-size: 30px;
            font-weight: 700;
            line-height: 1.35;
            margin-bottom: 12px;
            letter-spacing: -0.3px;
        }}

        .hero-subtitle {{
            font-size: 16px;
            font-weight: 400;
            color: #e2e8f0;
            margin-bottom: 18px;
            max-width: 980px;
        }}

        .hero-meta {{
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 14px;
            color: #cbd5e1;
            padding-top: 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
        }}

        .hero-meta span {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }}

        .hero-chips {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }}

        .hero-chip {{
            background: #ffffff;
            color: var(--primary);
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 600;
            box-shadow: var(--shadow-sm);
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }}

        /* Sticky Control Bar */
        .control-bar {{
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            padding: 12px 24px;
            margin-bottom: 30px;
            box-shadow: var(--shadow-sm);
        }}

        .control-container {{
            max-width: 1440px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }}

        .nav-links {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }}

        .nav-btn {{
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 7px 15px;
            background: #f1f5f9;
            color: var(--text-main);
            text-decoration: none;
            border-radius: 8px;
            font-size: 13.5px;
            font-weight: 600;
            border: 1px solid var(--border);
            transition: all 0.18s ease;
        }}

        .nav-btn:hover {{
            background: var(--primary);
            color: #ffffff;
            border-color: var(--primary);
        }}

        .search-box {{
            display: flex;
            align-items: center;
            position: relative;
            min-width: 300px;
        }}

        .search-input {{
            width: 100%;
            padding: 8px 14px 8px 36px;
            border-radius: 8px;
            border: 1px solid var(--border);
            font-family: inherit;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            background: #ffffff;
        }}

        .search-input:focus {{
            border-color: var(--secondary);
            box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.18);
        }}

        .search-icon {{
            position: absolute;
            left: 12px;
            color: var(--text-muted);
            pointer-events: none;
        }}

        /* Main Layout */
        .content-container {{
            max-width: 1440px;
            margin: 0 auto;
            padding: 0 24px;
        }}

        /* Pathway Visual Flow Steps */
        .pathway-flow {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
            gap: 12px;
            margin: 16px 0 32px 0;
        }}

        .flow-step {{
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-top: 4px solid var(--secondary);
            padding: 16px 14px;
            border-radius: 10px;
            box-shadow: var(--shadow-sm);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }}

        .flow-step:hover {{
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }}

        .flow-step-tag {{
            font-size: 12px;
            font-weight: 700;
            color: var(--secondary-dark);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }}

        .flow-step-title {{
            font-size: 14.5px;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 6px;
        }}

        .flow-step-desc {{
            font-size: 12.5px;
            color: var(--text-muted);
            line-height: 1.45;
        }}

        /* Content Styling */
        h1, h2, h3, h4 {{
            color: var(--primary-dark);
            font-weight: 700;
            line-height: 1.35;
        }}

        h1 {{
            font-size: 24px;
            border-bottom: 2px solid var(--primary-light);
            padding-bottom: 10px;
            margin-top: 36px;
            margin-bottom: 16px;
        }}

        .section-card {{
            margin-top: 44px;
            margin-bottom: 24px;
        }}

        .section-title {{
            background: linear-gradient(90deg, #0f3959 0%, #1e5a8a 100%);
            color: white !important;
            padding: 14px 20px;
            border-radius: 10px;
            border-bottom: none !important;
            box-shadow: var(--shadow-md);
        }}

        h2 {{
            font-size: 20px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
            margin-top: 28px;
            margin-bottom: 14px;
        }}

        h3 {{
            font-size: 17px;
            color: var(--secondary-dark);
            margin-top: 22px;
            margin-bottom: 10px;
        }}

        p {{
            margin-bottom: 14px;
        }}

        .divider {{
            border: none;
            height: 1px;
            background: var(--border);
            margin: 36px 0;
        }}

        /* Cards */
        .dataset-card {{
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 22px 20px;
            margin-bottom: 28px;
            box-shadow: var(--shadow-sm);
            scroll-margin-top: 80px;
        }}

        .dataset-header {{
            border-bottom: 1px solid var(--border-light) !important;
            padding-bottom: 10px !important;
            margin-top: 0 !important;
            margin-bottom: 16px !important;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--primary);
        }}

        .h-num {{
            background: var(--primary);
            color: white;
            font-size: 13.5px;
            padding: 3px 10px;
            border-radius: 6px;
            font-weight: 700;
        }}

        /* Table Styling */
        .table-responsive {{
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin: 16px 0 20px 0;
            border: 1px solid var(--border);
            border-radius: 10px;
            box-shadow: var(--shadow-sm);
            background: var(--bg-card);
        }}

        .data-table {{
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
        }}

        .data-table th {{
            background: var(--primary);
            color: #ffffff;
            font-weight: 600;
            padding: 12px 14px;
            border: 1px solid var(--primary-dark);
            white-space: nowrap;
        }}

        .data-table td {{
            padding: 12px 14px;
            border: 1px solid var(--border-light);
            vertical-align: top;
            line-height: 1.55;
        }}

        .data-table tbody tr:nth-child(even) {{
            background-color: #f8fafc;
        }}

        .data-table tbody tr:hover {{
            background-color: #f1f5f9;
        }}

        /* Condition Column Highlight */
        .col-condition {{
            background-color: var(--condition-bg) !important;
            border-left: 2px solid var(--condition-border) !important;
            color: var(--condition-text);
            font-size: 13.5px;
        }}

        /* Pathway Matrix Table Specifics */
        .matrix-table td:first-child {{
            font-weight: 700;
            color: var(--primary);
            white-space: nowrap;
            background: #f8fafc;
        }}

        .matrix-table td {{
            min-width: 165px;
        }}

        .matrix-table td.col-condition {{
            min-width: 280px;
            line-height: 1.6;
        }}

        /* Code & Badge Styles */
        code {{
            font-family: 'Fira Code', Consolas, Monaco, monospace;
            background: #e0f2fe;
            color: #0369a1;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
        }}

        .badge-file {{
            display: inline-block;
            font-size: 11.5px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 6px;
            letter-spacing: 0.3px;
            margin-right: 4px;
            margin-bottom: 2px;
            white-space: nowrap;
        }}

        .badge-person {{ background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }}
        .badge-home {{ background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }}
        .badge-death {{ background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }}
        .badge-specialpp {{ background: #fef08a; color: #854d0e; border: 1px solid #fde047; }}
        .badge-diag {{ background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }}
        .badge-dental {{ background: #ccfbf1; color: #115e59; border: 1px solid #99f6e4; }}
        .badge-ncd {{ background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }}
        .badge-chronic {{ background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }}
        .badge-lab {{ background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }}
        .badge-proc {{ background: #fae8ff; color: #86198f; border: 1px solid #f5d0fe; }}

        /* Lists */
        ul.list-bullet {{
            list-style-type: square;
            padding-left: 24px;
            margin-bottom: 16px;
        }}

        ol.list-number {{
            padding-left: 24px;
            margin-bottom: 16px;
        }}

        li {{
            margin-bottom: 6px;
            line-height: 1.6;
        }}

        a {{
            color: var(--secondary-dark);
            text-decoration: none;
            transition: color 0.15s;
        }}

        a:hover {{
            color: var(--primary);
            text-decoration: underline;
        }}

        /* Back to top button */
        .back-to-top {{
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--primary);
            color: white;
            padding: 10px 16px;
            border-radius: 30px;
            box-shadow: var(--shadow-md);
            font-size: 13.5px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            border: none;
            z-index: 90;
            transition: transform 0.2s, background 0.2s;
        }}

        .back-to-top:hover {{
            background: var(--secondary-dark);
            transform: translateY(-2px);
            text-decoration: none;
        }}

        /* Print CSS */
        @media print {{
            body {{
                background: white;
                color: black;
                font-size: 11pt;
                padding: 0;
            }}
            .hero-banner, .control-bar, .back-to-top {{
                display: none;
            }}
            .table-responsive {{
                overflow: visible;
                box-shadow: none;
                border: 1px solid #999;
            }}
            .data-table th {{
                background: #eee !important;
                color: black !important;
            }}
            .dataset-card {{
                box-shadow: none;
                border: 1px solid #ccc;
                page-break-inside: avoid;
            }}
        }}
    </style>
</head>
<body>

    <!-- Hero Banner -->
    <header class="hero-banner">
        <div class="hero-container">
            <span class="hero-tag">Official Health Data Specification V2</span>
            <h1 class="hero-title">ชุดข้อมูลที่เกี่ยวข้องด้านสุขภาพผู้สูงอายุ และขั้นตอนการดูแลรักษา (Data Set & Care Pathways V2)</h1>
            <p class="hero-subtitle">โครงสร้างชุดข้อมูลสุขภาพผู้สูงอายุมาตรฐาน 16 หมวดตามกรอบ 43 แฟ้ม กระทรวงสาธารณสุข และการแมปขั้นตอนการดูแลรักษา 9 ด้าน (Care Pathway Framework s1 – s7) พร้อมเงื่อนไขการประมวลผล (Conditions)</p>
            
            <div class="hero-meta">
                <span>🏛️ <strong>หน่วยงาน:</strong> กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข</span>
                <span>✉️ <strong>อีเมล:</strong> agingdmsinfo@gmail.com</span>
                <span>📞 <strong>โทร:</strong> 06 2272 0565</span>
            </div>

            <div class="hero-chips">
                <span class="hero-chip">📋 16 หมวด Data Set กรมการแพทย์</span>
                <span class="hero-chip">🏥 43 แฟ้มมาตรฐานกระทรวงสาธารณสุข</span>
                <span class="hero-chip">🔄 Care Pathway 9 ด้าน (s1 ถึง s7)</span>
                <span class="hero-chip">⚙️ Clinical Logic & Validation Conditions</span>
            </div>
        </div>
    </header>

    <!-- Sticky Navigation & Search Bar -->
    <div class="control-bar">
        <div class="control-container">
            <nav class="nav-links">
                <a href="#ส่วนที่-1-ชุดข้อมูล-16-หมวดตามโครงสร้างมาตรฐานกรมการแพทย์-43-แฟ้ม-conditions" class="nav-btn">📌 ส่วนที่ 1: ชุดข้อมูล 16 หมวด</a>
                <a href="#ส่วนที่-2-การแมปขั้นตอนการดูแลรักษา-9-ด้าน-care-pathway-framework-s1-s7-conditions" class="nav-btn">🔄 ส่วนที่ 2: Care Pathway 9 ด้าน</a>
                <a href="#ตารางแมปขั้นตอนการดูแลรักษา-9-ด้าน-pathway-matrix-s1-s7" class="nav-btn">📊 ตาราง Pathway Matrix</a>
                <a href="#รายละเอียดและเงื่อนไข-conditions-ในแต่ละขั้นตอน-s1-s7" class="nav-btn">⚙️ Conditions s1 – s7</a>
                <button onclick="window.print()" class="nav-btn" style="background: var(--primary); color: white; border: none; cursor: pointer;">🖨️ พิมพ์ / PDF</button>
            </nav>

            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="filterInput" class="search-input" placeholder="ค้นหารหัสโรค, แฟ้ม, ยา, เงื่อนไข..." onkeyup="filterTables()">
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <main class="content-container">
        
        <!-- Pathway Visual Steps Overview -->
        <section class="pathway-flow">
            <div class="flow-step">
                <div class="flow-step-tag">Step s1</div>
                <div class="flow-step-title">Screening</div>
                <div class="flow-step-desc">คัดกรองเบื้องต้นในชุมชน/ปฐมภูมิ ผ่านแฟ้ม <code>SPECIALPP</code> หรือ Blue Book</div>
            </div>
            <div class="flow-step">
                <div class="flow-step-tag">Step s2</div>
                <div class="flow-step-title">Pre-assessment</div>
                <div class="flow-step-desc">จำแนกผลการคัดกรอง ปกติ vs ผิดปกติ/เสี่ยง เพื่อส่งต่อขั้นตอนถัดไป</div>
            </div>
            <div class="flow-step">
                <div class="flow-step-tag">Step s3</div>
                <div class="flow-step-title">Detailed Assessment</div>
                <div class="flow-step-desc">ประเมินเชิงลึกตามแบบประเมินมาตรฐาน (MMSE, MoCA, SPPB, 9Q/8Q, MNA)</div>
            </div>
            <div class="flow-step">
                <div class="flow-step-tag">Step s4</div>
                <div class="flow-step-title">Management</div>
                <div class="flow-step-desc">ให้คำปรึกษา จัดทำ Care Plan และการส่งต่อแพทย์/สถานพยาบาลแม่ข่าย</div>
            </div>
            <div class="flow-step">
                <div class="flow-step-tag">Step s5</div>
                <div class="flow-step-title">Diagnosis</div>
                <div class="flow-step-desc">แพทย์วินิจฉัยยืนยันโรคตามมาตรฐาน <code>ICD-10</code> (รวม Dagger/Asterisk)</div>
            </div>
            <div class="flow-step">
                <div class="flow-step-tag">Step s6</div>
                <div class="flow-step-title">Treatment & Follow-up</div>
                <div class="flow-step-desc">ยาเฉพาะทาง, หัตถการ 7 หลัก, ICD-9-CM, แฟ้ม <code>DENTAL</code>, และการนัดหมาย</div>
            </div>
            <div class="flow-step">
                <div class="flow-step-tag">Step s7</div>
                <div class="flow-step-title">Clinical Outcomes</div>
                <div class="flow-step-desc">เฝ้าระวังอุบัติการณ์แทรกซ้อน (W00+S72, X60-X84) และการเสียชีวิตใน <code>DEATH</code></div>
            </div>
        </section>

        <!-- Dynamic Body Content parsed from V2 Markdown -->
        <div id="contentBody">
            {body_content}
        </div>

    </main>

    <!-- Floating Back to Top Button -->
    <a href="#" class="back-to-top">⬆️ กลับสู่ด้านบน</a>

    <!-- Client-side filter script -->
    <script>
        function filterTables() {{
            const input = document.getElementById('filterInput');
            const filter = input.value.toLowerCase().trim();
            const tables = document.querySelectorAll('table.data-table');
            
            tables.forEach(table => {{
                const rows = table.querySelectorAll('tbody tr');
                let anyVisible = false;
                
                rows.forEach(row => {{
                    const text = row.innerText.toLowerCase();
                    if (filter === '' || text.includes(filter)) {{
                        row.style.display = '';
                        anyVisible = true;
                    }} else {{
                        row.style.display = 'none';
                    }}
                }});
                
                const card = table.closest('.dataset-card');
                if (card && filter !== '') {{
                    card.style.display = anyVisible ? '' : 'none';
                }} else if (card) {{
                    card.style.display = '';
                }}
            }});
        }}
    </script>
</body>
</html>"""

    # Save to workspace docs
    workspace_html_path = "c:/Users/Piyanut/Desktop/Code_Work/docs/Elderly_Health_Dataset_Specification_and_Conditions_V2.html"
    with open(workspace_html_path, "w", encoding="utf-8") as f:
        f.write(html_template)
    print(f"Generated Workspace HTML: {workspace_html_path}")

if __name__ == "__main__":
    build_full_html()
