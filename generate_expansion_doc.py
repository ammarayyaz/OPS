import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_expansion_document(file_path):
    doc = docx.Document()

    # Set page margins (1 inch universal)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Color Palette (Dashboard Sample Orange)
    COLOR_TERRACOTTA = RGBColor(165, 60, 8)   # #A53C08
    COLOR_RUST = RGBColor(122, 41, 4)         # #7A2904
    COLOR_CHARCOAL = RGBColor(51, 55, 59)     # #33373B
    COLOR_MUTED = RGBColor(120, 125, 130)     # #787D82
    HEX_LIGHT_BG = "FBF8F5"
    HEX_TERRACOTTA = "A53C08"
    HEX_RUST = "7A2904"
    HEX_CHARCOAL = "33373B"
    HEX_BORDER = "E5E7EB"

    # Base Normal Style (Century Gothic)
    style_normal = doc.styles['Normal']
    font = style_normal.font
    font.name = 'Century Gothic'
    font.size = Pt(10.5)
    font.color.rgb = COLOR_CHARCOAL

    # Helper: Set Cell Shading
    def set_cell_background(cell, hex_color):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    # Helper: Set Cell Margins
    def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    # Helper: Add Styled Heading
    def add_custom_heading(text, level=1):
        p = doc.add_paragraph()
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Century Gothic'
        run.bold = True
        if level == 1:
            p.paragraph_format.space_before = Pt(20)
            p.paragraph_format.space_after = Pt(6)
            run.font.size = Pt(16)
            run.font.color.rgb = COLOR_TERRACOTTA
        elif level == 2:
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(4)
            run.font.size = Pt(13)
            run.font.color.rgb = COLOR_RUST
        elif level == 3:
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(2)
            run.font.size = Pt(11)
            run.font.color.rgb = COLOR_CHARCOAL
        return p

    # Helper: Callout Box
    def add_callout(title, text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, HEX_LIGHT_BG)
        set_cell_margins(cell, top=160, bottom=160, left=200, right=200)

        # Left border terracotta
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="24" w:space="0" w:color="{HEX_TERRACOTTA}"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
        tcPr.append(borders)

        cp = cell.paragraphs[0]
        cp.paragraph_format.space_after = Pt(3)
        trun = cp.add_run(title.upper())
        trun.font.name = 'Century Gothic'
        trun.font.size = Pt(10)
        trun.bold = True
        trun.font.color.rgb = COLOR_TERRACOTTA

        p2 = cell.add_paragraph()
        p2.paragraph_format.space_after = Pt(0)
        run = p2.add_run(text)
        run.font.name = 'Century Gothic'
        run.font.size = Pt(9.5)
        run.font.color.rgb = COLOR_CHARCOAL
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ==========================
    # COVER / HEADER TITLE BLOCK
    # ==========================
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_after = Pt(4)
    run_meta = p_meta.add_run("OUTLOOK PRODUCTIVITY SUITE // STRATEGIC PRODUCT ROADMAP")
    run_meta.font.name = 'Century Gothic'
    run_meta.font.size = Pt(9.5)
    run_meta.bold = True
    run_meta.font.color.rgb = COLOR_TERRACOTTA

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("Portal Feature Expansion & Innovation Guide")
    run_title.font.name = 'Century Gothic'
    run_title.font.size = Pt(24)
    run_title.bold = True
    run_title.font.color.rgb = COLOR_RUST

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(16)
    run_sub = p_sub.add_run("High-Impact Capabilities, Microsoft 365 Integrations, and Executive Productivity Tools to Enhance the Portal")
    run_sub.font.name = 'Century Gothic'
    run_sub.font.size = Pt(12)
    run_sub.font.color.rgb = COLOR_MUTED

    # Metadata table
    info_table = doc.add_table(rows=2, cols=4)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_table.autofit = False
    
    headers = [("DOCUMENT VERSION", "1.1.0"), ("STATUS", "Strategic Recommendation"), 
               ("TARGET INTEGRATION", "Microsoft Graph API v1.0"), ("CORE AESTHETIC", "Century Gothic / Orange Minimalist")]
    
    col_widths = [Inches(1.6), Inches(1.6), Inches(1.6), Inches(1.7)]
    for i, (k, v) in enumerate(headers):
        c_head = info_table.cell(0, i)
        c_val = info_table.cell(1, i)
        c_head.width = col_widths[i]
        c_val.width = col_widths[i]
        set_cell_background(c_head, HEX_LIGHT_BG)
        set_cell_background(c_val, "FFFFFF")
        set_cell_margins(c_head, 80, 80, 100, 100)
        set_cell_margins(c_val, 80, 80, 100, 100)
        
        p1 = c_head.paragraphs[0]
        r1 = p1.add_run(k)
        r1.font.name = 'Century Gothic'
        r1.font.size = Pt(8)
        r1.bold = True
        r1.font.color.rgb = COLOR_MUTED
        
        p2 = c_val.paragraphs[0]
        r2 = p2.add_run(v)
        r2.font.name = 'Century Gothic'
        r2.font.size = Pt(8.5)
        r2.bold = True
        r2.font.color.rgb = COLOR_CHARCOAL

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ==========================
    # EXECUTIVE SUMMARY
    # ==========================
    add_custom_heading("1. Executive Summary & Expansion Philosophy", level=1)
    p = doc.add_paragraph(
        "The current Outlook Productivity Suite (OPS) establishes an architectural, ultra-clean foundation for managing "
        "Pending Tasks and Aligned Strategic Objectives synced directly from Microsoft Outlook. "
        "As the portal matures, additional features can be introduced to elevate it from a focused task dashboard into an "
        "unmatched executive command center—while rigorously upholding your design principles: universal sharp geometry, "
        "zero visual fluff, zero emojis, zero status dots, and Century Gothic typography."
    )
    p.paragraph_format.space_after = Pt(8)

    add_callout(
        "Expansion Directive: High Signal, Zero Noise",
        "Every new tool added to this portal must reduce cognitive load rather than increase it. "
        "Features must leverage Microsoft Graph API intelligence in the background to automatically organize, "
        "summarize, and schedule work—presenting you with crisp, decisive actions rather than cluttered screens."
    )

    # ==========================
    # SECTION 2: AI & EMAIL TRIAGE
    # ==========================
    add_custom_heading("2. AI-Powered Email Triage & Thread Intelligence", level=1)
    
    p = doc.add_paragraph(
        "Instead of just listing flagged emails, the portal can harness natural language processing (via Microsoft Graph "
        "or secure LLM endpoints) to perform proactive cognitive labor on your incoming communication:"
    )
    p.paragraph_format.space_after = Pt(6)

    features_s2 = [
        ("Automated Action Item Extraction", 
         "When a high-priority email arrives or is flagged, AI analyzes the message body and extracts concrete deliverables (e.g., 'Submit quarterly audit response by Thursday 17:00'). It automatically drafts a pending task card with the counterparty name, context snippet, and proposed deadline."),
        ("One-Paragraph Thread Summarization", 
         "Long email threads involving multiple stakeholders are summarized into 2 to 3 concise, bulleted sentences visible inside an inspection side-sheet, eliminating the need to read through endless reply chains."),
        ("Executive Sentiment & Urgency Radar", 
         "Algorithmic detection of urgency signals (e.g., legal notices, escalations, board queries, contractual deadlines). Items requiring immediate personal intervention are automatically prioritized at the top of your Pending queue without adding colored dots or flashing badges."),
        ("One-Click Canned Responses (Graph SendMail)", 
         "Execute rapid triage directly from the portal: 'Acknowledged, reviewing today', 'Approved as submitted', or 'Deferring to next week'. Sends authenticated replies through your Outlook account without opening the bulky Outlook desktop app.")
    ]

    for title, desc in features_s2:
        add_custom_heading(f"• {title}", level=2)
        p = doc.add_paragraph(desc)
        p.paragraph_format.space_after = Pt(6)

    # ==========================
    # SECTION 3: CALENDAR & TIME-BLOCKING
    # ==========================
    add_custom_heading("3. Calendar Synchronization & Automated Time-Blocking", level=1)
    
    p = doc.add_paragraph(
        "Bridging task triage directly with your Outlook Calendar transforms your schedule from a passive appointment viewer "
        "into an active execution engine:"
    )
    p.paragraph_format.space_after = Pt(6)

    features_s3 = [
        ("Smart 'Focus Time' Auto-Blocking", 
         "When you move a task to 'Aligned', the portal can inspect your Outlook Calendar for open gaps and automatically book a dedicated 45-minute or 90-minute 'Focus Work: [Task Name]' calendar hold, protecting your time from meeting encroachment."),
        ("Meeting Preparation Dossier", 
         "For any upcoming calendar event today, the portal automatically attaches relevant flagged emails, previous meeting action points, and shared OneDrive files into a single pre-meeting briefing drawer 15 minutes before the start time."),
        ("Buffer Time Defense & Conflict Resolution", 
         "Detect back-to-back meeting fatigue. The system automatically inserts 10-minute focus buffers between consecutive calendar invites and suggests alternate open meeting slots using Microsoft Graph free/busy lookups."),
        ("Daily Meeting Load vs Focus Ratio", 
         "A minimal numeric metric showing how much of your workday is committed to meetings vs execution (e.g., '62% Meetings // 38% Focus Time'), helping you guard deep work blocks.")
    ]

    for title, desc in features_s3:
        add_custom_heading(f"• {title}", level=2)
        p = doc.add_paragraph(desc)
        p.paragraph_format.space_after = Pt(6)

    # ==========================
    # SECTION 4: M365 ECOSYSTEM INTEGRATIONS
    # ==========================
    add_custom_heading("4. Deeper Microsoft 365 Ecosystem Integrations", level=1)

    p = doc.add_paragraph(
        "Expand beyond Outlook Mail to aggregate the full suite of Microsoft 365 productivity tools into your unified command center:"
    )
    p.paragraph_format.space_after = Pt(6)

    features_s4 = [
        ("Microsoft Teams @Mentions & Action Items", 
         "Import chats and channel posts where you are explicitly @mentioned or assigned an action into your Pending triage queue, unifying fragmented communication across Teams and Outlook."),
        ("OneNote & Microsoft Loop Linking", 
         "Directly associate an Aligned Task with a shared OneNote meeting notebook or live Microsoft Loop workspace, providing instant access to collaborative notes without leaving the portal."),
        ("OneDrive / SharePoint Key Attachment Shelf", 
         "A dedicated minimal shelf listing critical documents (PDFs, spreadsheets, slide decks) attached to your flagged emails and upcoming calendar appointments, accessible with single-click previews."),
        ("Microsoft Planner & To Do Team Synchronization", 
         "Bidirectional sync with team Planner boards. Tasks assigned to you by project managers or colleagues automatically appear in your Aligned workspace categorized under their parent initiative.")
    ]

    for title, desc in features_s4:
        add_custom_heading(f"• {title}", level=2)
        p = doc.add_paragraph(desc)
        p.paragraph_format.space_after = Pt(6)

    # ==========================
    # SECTION 5: EXECUTIVE WORKFLOW TOOLS
    # ==========================
    add_custom_heading("5. Executive Decision & Workflow Enhancements", level=1)

    features_s5 = [
        ("Automated Morning Briefing & End-of-Day Digest", 
         "At 08:30 each morning, the portal generates a clean 1-screen briefing: today's non-negotiable commitments, top 3 pending emails, and calendar schedule. At 17:30, it delivers an End-of-Day Clearance summary showing items triaged, meetings completed, and items deferred to tomorrow."),
        ("Delegation & Assignment Gateway", 
         "Delegate pending emails or tasks to team members or executive assistants with one click. The portal can draft an automated forwarding note in Outlook and track the item under a 'Delegated' status until resolved."),
        ("VIP Client & Executive Watchlist", 
         "Define critical email addresses (e.g., Board Members, Key Clients, Chief Executive). Messages from these individuals bypass standard filters and surface immediately in your primary focus queue."),
        ("Task Effort Tagging & Workload Forecasting", 
         "Assign lightweight effort estimates (15 min, 30 min, 1 hour). The portal calculates the total hours needed to achieve 'Inbox Zero', preventing overcommitment on busy calendar days.")
    ]

    for title, desc in features_s5:
        add_custom_heading(f"• {title}", level=2)
        p = doc.add_paragraph(desc)
        p.paragraph_format.space_after = Pt(6)

    # ==========================
    # SECTION 6: PRIORITIZATION MATRIX TABLE
    # ==========================
    add_custom_heading("6. Implementation Prioritization Matrix", level=1)
    
    p = doc.add_paragraph(
        "To maximize return on investment while preserving interface simplicity, the proposed features are mapped "
        "by business value and implementation complexity:"
    )
    p.paragraph_format.space_after = Pt(8)

    # Table: 8 rows, 4 cols
    table = doc.add_table(rows=9, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    t_headers = ["FEATURE CAPABILITY", "STRATEGIC VALUE", "TECHNICAL EFFORT", "RECOMMENDED PHASE"]
    t_widths = [Inches(2.5), Inches(1.3), Inches(1.3), Inches(1.4)]

    # Format header row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(t_headers):
        hdr_cells[i].width = t_widths[i]
        set_cell_background(hdr_cells[i], HEX_TERRACOTTA)
        set_cell_margins(hdr_cells[i], 120, 120, 120, 120)
        p = hdr_cells[i].paragraphs[0]
        r = p.add_run(title)
        r.font.name = 'Century Gothic'
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    data_rows = [
        ("AI Action Item Extraction from Flagged Mail", "Very High", "Medium (Graph API + LLM)", "Phase 2 (Immediate)"),
        ("Smart Calendar Focus Time Auto-Blocking", "High", "Low (Graph Calendars API)", "Phase 2 (Immediate)"),
        ("Daily Morning & EOD Executive Digests", "High", "Low (Client-Side State)", "Phase 2 (Immediate)"),
        ("One-Click Canned Responses (SendMail)", "High", "Low (Graph Mail.Send)", "Phase 2 (Immediate)"),
        ("Microsoft Teams @Mention Sync", "High", "Medium (Graph Teams API)", "Phase 3 (Next Sprint)"),
        ("VIP Executive & Client Watchlist Rules", "Medium", "Low (Filter Engine)", "Phase 3 (Next Sprint)"),
        ("Meeting Prep Dossier & Attachment Shelf", "High", "Medium (Graph Drive/Mail)", "Phase 3 (Next Sprint)"),
        ("Task Delegation & Assignment Gateway", "Medium", "Medium (Outlook Routing)", "Phase 4 (Future)")
    ]

    for row_idx, data in enumerate(data_rows, start=1):
        row_cells = table.rows[row_idx].cells
        bg_col = "FFFFFF" if row_idx % 2 != 0 else HEX_LIGHT_BG
        for col_idx, text in enumerate(data):
            row_cells[col_idx].width = t_widths[col_idx]
            set_cell_background(row_cells[col_idx], bg_col)
            set_cell_margins(row_cells[col_idx], 90, 90, 120, 120)
            
            p = row_cells[col_idx].paragraphs[0]
            r = p.add_run(text)
            r.font.name = 'Century Gothic'
            r.font.size = Pt(8.5)
            if col_idx == 0:
                r.bold = True
                r.font.color.rgb = COLOR_CHARCOAL
            elif col_idx == 1:
                r.font.color.rgb = COLOR_TERRACOTTA if "High" in text else COLOR_CHARCOAL
            else:
                r.font.color.rgb = COLOR_CHARCOAL

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ==========================
    # SECTION 7: SUMMARY & NEXT STEPS
    # ==========================
    add_custom_heading("7. Recommended Next Steps", level=1)
    
    steps = [
        ("Select Phase 2 Features", "Review the table above and choose which 2 to 3 additions would deliver the most immediate personal value (e.g., Focus Time Auto-Blocking or Daily Executive Digests)."),
        ("Extend Microsoft Graph Scopes", "Ensure required delegated scopes (`Calendars.ReadWrite`, `Mail.Send`, `ChatMessage.Read`) are included in your Azure Entra App Registration."),
        ("Maintain Architectural Restraint", "Implement new modules within dedicated sub-views or clean slide-in drawers, strictly preserving zero-emoji, zero-glow, and Century Gothic aesthetics.")
    ]

    for title, desc in steps:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        r_num = p.add_run(f"Step {steps.index((title, desc)) + 1}: {title} — ")
        r_num.font.name = 'Century Gothic'
        r_num.bold = True
        r_num.font.color.rgb = COLOR_TERRACOTTA
        r_desc = p.add_run(desc)
        r_desc.font.name = 'Century Gothic'
        r_desc.font.color.rgb = COLOR_CHARCOAL

    doc.save(file_path)
    print(f"Document successfully created at {file_path}")

if __name__ == "__main__":
    output_path = r"d:\.gemini\antigravity-ide\scratch\Outlook Software\Outlook_Portal_Feature_Expansion_Guide.docx"
    create_expansion_document(output_path)
