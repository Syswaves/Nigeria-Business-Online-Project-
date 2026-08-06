const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Find the place where the email is being prepared
const attachCode = `      const attachments: any[] = [];
      const addAttachment = (url: string | undefined, filename: string) => {
        if (url && url.startsWith('data:')) {
          const match = url.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            let ext = match[1].split('/')[1] || 'bin';
            if (ext === 'jpeg') ext = 'jpg';
            if (ext === 'vnd.openxmlformats-officedocument.wordprocessingml.document') ext = 'docx';
            if (ext === 'msword') ext = 'doc';
            attachments.push({
              filename: \`\${filename}.\${ext}\`,
              content: match[2],
              encoding: 'base64'
            });
          }
        } else if (url) {
          attachments.push({
             filename: filename,
             path: url
          });
        }
      };
      
      addAttachment(savedBusiness.logoUrl, 'logo');
      addAttachment(savedBusiness.certificateOfIncorporationUrl, 'certificate');
      addAttachment(savedBusiness.companyProfileUrl, 'company-profile');
      addAttachment(savedBusiness.promoVideoUrl, 'promo-video');
      addAttachment(savedBusiness.promoPhoto1Url, 'promo-photo-1');
      addAttachment(savedBusiness.promoPhoto2Url, 'promo-photo-2');
      addAttachment(savedBusiness.promoPhoto3Url, 'promo-photo-3');
      addAttachment(savedBusiness.promoPhoto4Url, 'promo-photo-4');
      addAttachment(savedBusiness.promoPhoto5Url, 'promo-photo-5');
      
`;

const sendMailReplacement = `      await transporter.sendMail({
        from: smtpConfig.fromEmail || \`"Nigeria Business Online" <\${smtpConfig.user}>\`,
        to: "businessprofiling@nigeriabusinessonline.com",
        cc: "nigeriabusinessonlineproject@gmail.com",
        subject: \`New Business Profiling Submission - \${savedBusiness.name}\`,
        attachments,
        text: \`A new business has been submitted for profiling.\n\n\` +
          \`Company Name: \${savedBusiness.name || 'N/A'}\n\` +
          \`RC Number: \${savedBusiness.rcNumber || 'N/A'}\n\` +
          \`Category: \${savedBusiness.category || 'N/A'}\n\` +
          \`Email: \${savedBusiness.email || 'N/A'}\n\` +
          \`Phone: \${savedBusiness.phone || 'N/A'}\n\` +
          \`WhatsApp: \${savedBusiness.whatsapp || 'N/A'}\n\` +
          \`Location: \${savedBusiness.location || 'N/A'}\n\` +
          \`Website: \${savedBusiness.website || 'N/A'}\n\` +
          \`Slogan: \${savedBusiness.slogan || 'N/A'}\n\` +
          \`About Us: \${savedBusiness.aboutUs || 'N/A'}\n\` +
          \`Services: \${savedBusiness.services || 'N/A'}\n\` +
          \`Facebook: \${savedBusiness.facebookUrl || 'N/A'}\n\` +
          \`Instagram: \${savedBusiness.instagramUrl || 'N/A'}\n\` +
          \`Twitter: \${savedBusiness.twitterUrl || 'N/A'}\n\` +
          \`LinkedIn: \${savedBusiness.linkedinUrl || 'N/A'}\n\n\` +
          \`Please check the admin dashboard for more details and see the attached files.\`,
        html: \`<h3>New Business Profiling Submission</h3>
<p>A new business has been submitted for profiling.</p>
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 800px;">
  <tr><td><strong>Company Name:</strong></td><td>\${savedBusiness.name || 'N/A'}</td></tr>
  <tr><td><strong>RC Number:</strong></td><td>\${savedBusiness.rcNumber || 'N/A'}</td></tr>
  <tr><td><strong>Category:</strong></td><td>\${savedBusiness.category || 'N/A'}</td></tr>
  <tr><td><strong>Email:</strong></td><td>\${savedBusiness.email || 'N/A'}</td></tr>
  <tr><td><strong>Phone:</strong></td><td>\${savedBusiness.phone || 'N/A'}</td></tr>
  <tr><td><strong>WhatsApp:</strong></td><td>\${savedBusiness.whatsapp || 'N/A'}</td></tr>
  <tr><td><strong>Location:</strong></td><td>\${savedBusiness.location || 'N/A'}</td></tr>
  <tr><td><strong>Website:</strong></td><td>\${savedBusiness.website || 'N/A'}</td></tr>
  <tr><td><strong>Slogan:</strong></td><td>\${savedBusiness.slogan || 'N/A'}</td></tr>
  <tr><td><strong>About Us:</strong></td><td>\${savedBusiness.aboutUs || 'N/A'}</td></tr>
  <tr><td><strong>Services:</strong></td><td>\${savedBusiness.services || 'N/A'}</td></tr>
  <tr><td><strong>Facebook:</strong></td><td>\${savedBusiness.facebookUrl || 'N/A'}</td></tr>
  <tr><td><strong>Instagram:</strong></td><td>\${savedBusiness.instagramUrl || 'N/A'}</td></tr>
  <tr><td><strong>Twitter:</strong></td><td>\${savedBusiness.twitterUrl || 'N/A'}</td></tr>
  <tr><td><strong>LinkedIn:</strong></td><td>\${savedBusiness.linkedinUrl || 'N/A'}</td></tr>
</table>
<h4>Uploaded Documents</h4>
<p>\${attachments.length > 0 ? attachments.length + " file(s) have been attached to this email." : "No files were uploaded."}</p>
<p>Please check the admin dashboard for more details.</p>\`
      });`;

// Find where await transporter.sendMail({ is
code = code.replace(/await transporter\.sendMail\(\{\s*from: smtpConfig\.fromEmail[\s\S]*?Please check the admin dashboard for more details\.<\/p>`\n      \}\);/, attachCode + sendMailReplacement);

fs.writeFileSync('server.ts', code);
