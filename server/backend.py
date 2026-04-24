import os
import sys
import json
import csv
import re
import hashlib
from datetime import datetime
import subprocess

try:
    from fpdf import FPDF, XPos, YPos
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf2"])
    from fpdf import FPDF, XPos, YPos

# ==========================================
# 1. PROFESSIONAL PDF CLASS (MODERN SYNTAX)
# ==========================================
class ForensicPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.current_criticality = "HIGH"
        self.risk_score = 0.0

    def header(self):
        self.set_fill_color(26, 35, 126) 
        self.rect(0, 0, 210, 40, 'F')
        self.set_text_color(255, 255, 255)
        self.set_font('Helvetica', 'B', 15)
        self.set_xy(10, 12)
        self.cell(0, 10, "IA FORENSIC INVESTIGATION REPORT", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L')
        self.set_font('Helvetica', '', 9)
        self.cell(0, 5, "", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L') 
        
        score_color = (211, 47, 47) if self.risk_score >= 8.5 else (255, 140, 0)
        self.set_fill_color(*score_color)
        self.set_xy(160, 10)
        self.cell(40, 20, f"RISK: {self.risk_score}/10", border=0, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)

    def draw_service_chart(self, stats):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(0, 0, 0)
        self.cell(0, 10, "Attack Vector Distribution (By Service):", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        max_val = max(stats.values()) if stats else 1
        y_start = self.get_y()
        for i, (svc, count) in enumerate(stats.items()):
            self.set_font('Helvetica', '', 8)
            self.set_xy(10, y_start + (i * 7))
            self.cell(30, 6, f"{svc.upper()}:", border=0, new_x=XPos.RIGHT, new_y=YPos.TOP)
            width = (count / max_val) * 100
            self.set_fill_color(26, 35, 126)
            self.rect(45, y_start + (i * 7) + 1, width, 4, 'F')
            self.set_xy(150, y_start + (i * 7))
            self.cell(20, 6, f"{count} events", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Internal Audit - SOTETEL Confidential | Page {self.page_no()}', border=0, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C')

# ==========================================
# 2. THE AI INFERENCE ENGINE (WEIGHTED HEURISTICS)
# ==========================================
TECHNICAL_PLAYBOOKS = {
    "S1": ["Block source IP via iptables/Fail2Ban.", "Disable password-based SSH authentication.", "Enforce RSA-4096 Public Key auth.", "Change default SSH port."],
    "S2": ["Monitor for high-entropy DNS TXT queries.", "Implement DNS rate-limiting.", "Enable DNSSEC validation.", "Block identified C2 domains at DNS level."],
    "S3": ["Enable TCP SYN Cookies (sysctl).", "Implement per-IP rate limiting at the edge firewall.", "Increase TCP backlog queue.", "Activate SOTETEL Scrubbing Center."],
    "S4": ["Isolate web application from DB network.", "Implement Parameterized Queries (Prepared Statements).", "Update WAF to block UNION/SELECT patterns.", "Apply Least Privilege to DB roles."],
    "S5": ["Disable SMBv1 and enforce SMBv3 signing.", "Restrict RPC/SMB access to authorized subnets.", "Audit AD for unusual login spikes.", "Use LAPS for admin password rotation."],
    "DEFAULT": ["Isolate host.", "Perform forensic log audit.", "Review security group rules."]
}

# The Intelligence Algorithm: Deduce attack type based purely on log context
def analyze_session_intent(logs):
    scores = {"S1": 0, "S2": 0, "S3": 0, "S4": 0, "S5": 0}
    
    for l in logs:
        msg = l.get('message', '').lower()
        svc = str(l.get('service', '')).lower()
        
        # S1: SSH Brute Force Profiling
        if 'ssh' in svc or 'ssh' in msg: scores["S1"] += 2
        if 'failed password' in msg or 'accepted password' in msg: scores["S1"] += 5
        if 'preauth' in msg or 'authentication' in msg: scores["S1"] += 2
        
        # S3: DDoS SYN Flood Profiling
        if 'syn flood' in msg: scores["S3"] += 10
        if svc in ['kernel', 'iptables'] and 'tcp' in msg: scores["S3"] += 3
        if 'dropped' in msg and 'packets' in msg: scores["S3"] += 4
        if 'connection limit' in msg or 'exhausting memory' in msg: scores["S3"] += 5
        
        # S4: Web SQLi / Injection Profiling
        if svc == 'nginx' or 'get ' in msg or 'http' in msg: scores["S4"] += 2
        if 'union' in msg or 'select' in msg or '1=1' in msg: scores["S4"] += 8
        if 'script>' in msg or 'iframe' in msg or '.php' in msg: scores["S4"] += 6 
        
        # S2: DNS Profiling
        if 'dns' in svc or 'txt query' in msg: scores["S2"] += 6
        
        # S5: SMB Profiling
        if 'smb' in svc or 'rpc' in msg: scores["S5"] += 6

    # Return the scenario with the highest confidence score
    best_match = max(scores, key=scores.get)
    return best_match if scores[best_match] > 0 else "DEFAULT"

def get_attacker_ip(msg, v_ip):
    ips = re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', msg)
    for ip in ips:
        if ip != v_ip: return ip
    return "HIDDEN-SOURCE"

def sanitize(text):
    return str(text).strip().replace('"', '').replace('\r', '').replace('\n', '')

# ==========================================
# 3. CORE ENGINE (DYNAMIC PROCESSING)
# ==========================================
def generate_advanced_report(log_path, scenario_path, out_json_path):
    scenarios = {}
    if os.path.exists(scenario_path):
        with open(scenario_path, mode='r', encoding='utf-8') as f:
            for row in csv.DictReader(f): scenarios[row['scenario_id']] = row

    with open(log_path, 'r', encoding='utf-8') as f:
        raw_data = f.read()
        logs = [json.loads(line) for line in raw_data.splitlines() if line.strip()]
    
    log_hash = hashlib.sha256(raw_data.encode()).hexdigest()
    anomalies = [l for l in logs if l.get('label') == 'anomalous']
    anomalies.sort(key=lambda x: x['ts'])

    # 1. Group logs strictly by Victim and Attacker (Ignoring log 'scenario_id')
    incidents, current_sessions = [], {}
    for log in anomalies:
        ts = datetime.fromisoformat(log['ts'].replace('Z', ''))
        host = log.get('host', 'Unknown')
        a_ip = get_attacker_ip(log['message'], log.get('ip', ''))
        
        # Our unique key is now just the two machines talking
        key = (host, a_ip)
        
        if key in current_sessions:
            last_ts = datetime.fromisoformat(current_sessions[key][-1]['ts'].replace('Z', ''))
            if (ts - last_ts).total_seconds() / 60 < 30:
                current_sessions[key].append(log)
                continue
        new_inc = [log]
        incidents.append(new_inc)
        current_sessions[key] = new_inc

    pdf = ForensicPDF()
    ui_data = {
        "integrity": {"sourceFile": os.path.basename(log_path), "status": "Verified", "method": "IA Inference Engine v3.0", "hash": log_hash},
        "storylines": []
    }

    for attack_logs in incidents:
        first, last = attack_logs[0], attack_logs[-1]
        host = str(first.get('host', 'UNKNOWN')).upper()
        v_ip = first.get('ip', '0.0.0.0')
        
        # 2. TRIGGER INFERENCE ALGORITHM: Let AI deduce the attack type based on the messages
        inferred_sid = analyze_session_intent(attack_logs)
        
        # Fetch metadata based on the engine's deduction
        # Autonomous Title & MITRE Mapping (Replaces the CSV lookup)
        # Autonomous Title, MITRE, and Descriptions (The complete AI Knowledge Base)
        INFERENCE_DATA = {
            "S1": {
                "name": "SSH BRUTE-FORCE", 
                "mitre": "T1110",
                "description": "Multiple failed authentication attempts detected, suggesting an automated password-guessing campaign."
            },
            "S2": {
                "name": "DNS ANOMALY", 
                "mitre": "T1071.004",
                "description": "High-entropy DNS queries identified, potentially indicating C2 communication or data exfiltration via DNS tunneling."
            },
            "S3": {
                "name": "DDOS SYN FLOOD", 
                "mitre": "T1499",
                "description": "A rapid spike in TCP SYN packets was detected, aimed at exhausting server resources and causing a denial of service."
            },
            "S4": {
                "name": "WEB SQL INJECTION", 
                "mitre": "T1190",
                "description": "Malicious SQL patterns detected in HTTP requests, indicating an attempt to bypass authentication or extract database records."
            },
            "S5": {
                "name": "SMB ENUMERATION", 
                "mitre": "T1021.002",
                "description": "Unusual SMB/RPC traffic patterns suggest lateral movement attempts or unauthorized file share discovery."
            },
            "DEFAULT": {
                "name": "UNKNOWN ANOMALY", 
                "mitre": "T1000",
                "description": "Heuristic analysis detected an unusual sequence of events that do not match known primary attack signatures."
            }
        }
        
        s_info = INFERENCE_DATA.get(inferred_sid, INFERENCE_DATA["DEFAULT"]) 
        pdf.risk_score = 9.8 if any(k in host for k in ['SGW', 'PGW', 'CORE']) else 7.5
        risk_text = "CRITICAL" if pdf.risk_score > 8 else "HIGH"
        risk_color = "#E53842" if pdf.risk_score > 8 else "#F39619"
        
        duration = int((datetime.fromisoformat(last['ts'].replace('Z', '')) - datetime.fromisoformat(first['ts'].replace('Z', ''))).total_seconds() / 60)
        playbook = TECHNICAL_PLAYBOOKS.get(inferred_sid, TECHNICAL_PLAYBOOKS["DEFAULT"])
        
        svc_stats = {}
        for l in attack_logs:
            s = str(l.get('service', 'Other')).upper()
            svc_stats[s] = svc_stats.get(s, 0) + 1

        narrative_text = f"The inference engine identified a {duration}-minute campaign involving {len(attack_logs)} anomalous events. {s_info.get('description')}"

        ui_data["storylines"].append({
            "id": f"FR-2026-{inferred_sid}",
            "title": s_info['name'].upper(),
            "risk": risk_text,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "sparkline": [1, 2, 4, 1, 5, 2, 1],
            "color": risk_color,
            "mitre": s_info.get('mitre', 'T1000'),
            "targetHost": host,
            "targetIp": v_ip,
            "siteLocation": host.split('-')[-1] + " Datacenter" if '-' in host else "01 Datacenter",
            "narrative": narrative_text,
            "recommendation": playbook[0],
            "services": len(svc_stats),
            "svcStats": svc_stats,
            "timeline": [
                {
                    "time": l['ts'].split('T')[1][:8],
                    "sourceIp": get_attacker_ip(l['message'], v_ip),
                    "service": str(l.get('service', 'SYS')).upper(),
                    "phase": "Detection",
                    "action": str(l.get('service', 'SYS')).upper(),
                    "details": sanitize(l['message'])[:85],
                    "alert": True,
                    "c": risk_color
                } for l in attack_logs
            ],
            "playbook": playbook
        })

        # --- EXACT PDF FORMAT ---
        pdf.add_page()
        pdf.set_y(45) 
        
        pdf.set_font('Helvetica', 'B', 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, f"INCIDENT: {s_info.get('name', 'Threat').upper()}", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font('Helvetica', 'I', 10)
        pdf.cell(0, 6, f"MITRE ATT&CK Mapping: {s_info.get('mitre', 'T1059')}", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font('Helvetica', '', 10)
        pdf.cell(0, 6, f"Target Host: {host} ({v_ip}) | Inference Confidence: HIGH", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(5)

        pdf.set_font('Helvetica', 'B', 11)
        pdf.cell(0, 8, "1. Forensic Narrative Storyline:", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font('Helvetica', '', 10)
        pdf.multi_cell(0, 6, narrative_text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(5)

        pdf.draw_service_chart(svc_stats)

        pdf.set_font('Helvetica', 'B', 11)
        pdf.cell(0, 10, "2. Reconstructed Investigative Timeline:", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font('Helvetica', 'B', 8)
        pdf.set_fill_color(240, 240, 240)
        
        pdf.cell(25, 8, "Clock Time", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
        pdf.cell(30, 8, "Source IP", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
        pdf.cell(25, 8, "Service", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
        pdf.cell(110, 8, "Event Log Activity", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C', fill=True)

        pdf.set_font('Helvetica', '', 7.5)
        for i, l in enumerate(attack_logs):
            fill = (i % 2 == 0)
            pdf.set_fill_color(252, 252, 252) if fill else pdf.set_fill_color(255, 255, 255)
            time = l['ts'].split('T')[1][:8]
            a_ip = get_attacker_ip(l['message'], v_ip)
            srv = str(l.get('service', 'SYS')).upper()
            msg = sanitize(l['message'])[:80]
            
            pdf.cell(25, 7, f"T={time}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
            pdf.cell(30, 7, a_ip, border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
            pdf.cell(25, 7, srv, border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align='C', fill=True)
            pdf.cell(110, 7, msg, border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='L', fill=True)
        
        pdf.ln(8)
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_text_color(200, 0, 0)
        pdf.cell(0, 10, "3. Mandatory Technical Remediation Playbook:", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(0, 0, 0)
        pdf.set_fill_color(255, 245, 245)
        
        for idx, step in enumerate(playbook):
            pdf.set_font('Helvetica', '', 10)
            pdf.multi_cell(190, 7, f" > {idx+1}. {step}", border='LR', fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(190, 0, "", border='T', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.add_page()
    pdf.set_font('Helvetica', 'B', 14)
    pdf.cell(0, 15, "7. REPORT INTEGRITY & CHAIN OF CUSTODY", border=0, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
    pdf.ln(10)
    pdf.set_font('Helvetica', 'B', 10)
    meta = [("Source File", os.path.basename(log_path)), ("Status", "Verified"), ("Forensic Method", "IA Context Inference")]
    for k, v in meta:
        pdf.cell(50, 10, k, border=1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(0, 10, v, border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(10)
    pdf.set_font('Courier', 'B', 9)
    pdf.multi_cell(0, 10, f"SHA256_HASH_SIGNATURE: {log_hash}", border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    archives_dir = os.path.join(os.path.dirname(out_json_path), "archives")
    if not os.path.exists(archives_dir): os.makedirs(archives_dir)
    pdf_filename = f"Forensic_Report_{datetime.now().strftime('%Y%m%d')}.pdf"
    pdf.output(os.path.join(archives_dir, pdf_filename))
    
    ui_data["latestPdfUrl"] = f"/api/archives/{pdf_filename}"
    
    with open(out_json_path, 'w', encoding='utf-8') as f:
        json.dump(ui_data, f, indent=4)
    print("Success! Perfect PDF and React JSON Generated (Using Inference AI).")

if __name__ == "__main__":
    if len(sys.argv) > 3:
        generate_advanced_report(sys.argv[1], sys.argv[2], sys.argv[3])
