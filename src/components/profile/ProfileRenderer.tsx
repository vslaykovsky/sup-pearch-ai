import React from 'react';

interface ProfileRendererProps {
  result: any;
  filteredProfile: any;
  settings?: any;
}

const ProfileRenderer: React.FC<ProfileRendererProps> = ({ result, filteredProfile, settings }) => {
  if (!result) {
    return null;
  }

  return (
    <div key={result.docid} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
      {/* Search Result Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: '0', color: '#fff' }}>
          Score: {result.score === null || result.score === undefined ? '-' : result.score}/4
        </h4>
        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>ID: {result.docid}</span>
      </div>
      
       
      {/* Insights Display */}
      {result.insights && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Overall Summary</h6>
          <p style={{ margin: '0 0 0.75rem 0', opacity: 0.9, fontSize: '0.85rem', lineHeight: '1.4' }}>
            {result.insights.overall_summary}
          </p>
          
          {result.insights.query_insights && result.insights.query_insights.length > 0 && (
            <div>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Query Insights</h6>
              {result.insights.query_insights.map((insight: any, insightIdx: number) => (
                <div key={insightIdx} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>{insight.match_level}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7, background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                      {insight.priority}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', opacity: 0.9 }}>{insight.short_rationale}</p>
                  <p style={{ margin: '0', fontSize: '0.75rem', opacity: 0.7, fontStyle: 'italic' }}>{insight.subquery}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
 
      
      {/* Profile Content */}
      {filteredProfile && (
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            {filteredProfile.picture_url ? (
              <img 
                src={filteredProfile.picture_url} 
                alt="Profile" 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  marginRight: '1rem',
                  objectFit: 'cover'
                }} 
              />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginRight: '1rem' }}>
                {`${filteredProfile.first_name || ''} ${filteredProfile.last_name || ''}`.split(' ').map((n: string) => n[0]).join('')}
              </div>
            )}
            <div>
              <h5 style={{ margin: '0 0 0.25rem 0', color: '#fff', fontSize: '1.1rem' }}>
                {`${filteredProfile.first_name || ''} ${filteredProfile.last_name || ''}`}
              </h5>
              {filteredProfile.title && (
                <p style={{ margin: '0 0 0.25rem 0', opacity: 0.9, fontSize: '0.9rem' }}>
                  {filteredProfile.title}
                </p>
              )}
              {filteredProfile.location && (
                <p style={{ margin: '0 0 0.25rem 0', opacity: 0.7, fontSize: '0.8rem' }}>
                  📍 {filteredProfile.location}
                </p>
              )}
              {filteredProfile.total_experience_years && (
                <p style={{ margin: '0', opacity: 0.7, fontSize: '0.8rem' }}>
                  💼 {filteredProfile.total_experience_years} years experience
                </p>
              )}
              {filteredProfile.estimated_age && (
                <p style={{ margin: '0', opacity: 0.7, fontSize: '0.8rem' }}>
                  🎂 ~{Math.round(filteredProfile.estimated_age)} years old
                </p>
              )}
              {filteredProfile.is_opentowork && (
                <p style={{ margin: '0', opacity: 0.7, fontSize: '0.8rem' }}>
                  🔍 Open to work
                </p>
              )}
              {filteredProfile.is_hiring && (
                <p style={{ margin: '0', opacity: 0.7, fontSize: '0.8rem' }}>
                  💼 Currently hiring
                </p>
              )}
              {filteredProfile.is_top_universities && (
                <p style={{ margin: '0', opacity: 0.7, fontSize: '0.8rem' }}>
                  🎓 Top university graduate
                </p>
              )}
            </div>
          </div>
          
          {/* Summary */}
          {filteredProfile.summary && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <p style={{ margin: '0', fontSize: '0.85rem', opacity: 0.9, lineHeight: '1.4' }}>
                {filteredProfile.summary}
              </p>
            </div>
          )}
          
          {/* Contact Information */}
          {filteredProfile.emails && filteredProfile.emails.length > 0 && (
            <div style={{ marginBottom: '1rem', fontSize: '0.8rem', opacity: 0.8 }}>
              {filteredProfile.emails.map((email: string, emailIdx: number) => (
                <div key={emailIdx} style={{ marginBottom: '0.5rem' }}>📧 {email}</div>
              ))}
            </div>
          )}
          
          {/* LinkedIn Profile */}
          {filteredProfile.linkedin_slug && (
            <div style={{ marginBottom: '1rem', fontSize: '0.8rem', opacity: 0.8 }}>
              <div style={{ marginBottom: '0.5rem' }}>
                💼 <a href={`https://linkedin.com/in/${filteredProfile.linkedin_slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>LinkedIn Profile</a>
                {filteredProfile.follower_count && (
                  <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                    ({filteredProfile.follower_count} followers)
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {filteredProfile.languages && filteredProfile.languages.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Languages</h6>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {filteredProfile.languages.map((lang: string, langIdx: number) => (
                  <span key={langIdx} style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    opacity: 0.8
                  }}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Expertise */}
          {filteredProfile.expertise && filteredProfile.expertise.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Expertise</h6>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {filteredProfile.expertise.map((skill: string, skillIdx: number) => (
                  <span key={skillIdx} style={{ 
                    background: 'rgba(255,255,255,0.1)', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    opacity: 0.8
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Work Experience */}
          {filteredProfile.experiences && filteredProfile.experiences.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Work Experience</h6>
              {filteredProfile.experiences.map((exp: any, expIdx: number) => (
                <div key={expIdx} style={{ marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                  {exp.company_roles && exp.company_roles.map((role: any, roleIdx: number) => (
                    <div key={roleIdx} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {role.title} at {exp.company_info?.name || role.company || 'Unknown Company'}
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                        {role.duration_years} years • {role.location}
                        {role.start_date && role.end_date && (
                          <span> • {new Date(role.start_date).getFullYear()} - {new Date(role.end_date).getFullYear()}</span>
                        )}
                      </div>
                      {role.experience_summary && (
                        <div style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.5rem' }}>{role.experience_summary}</div>
                      )}
                      
                      {/* Company Info */}
                      {exp.company_info && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {exp.company_info.industries && exp.company_info.industries.length > 0 && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>Industry:</strong> {exp.company_info.industries.join(', ')}
                            </div>
                          )}
                          {exp.company_info.num_employees_range && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>Size:</strong> {exp.company_info.num_employees_range}
                            </div>
                          )}
                          {exp.company_info.founded_in && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>Founded:</strong> {exp.company_info.founded_in}
                            </div>
                          )}
                          {exp.company_info.description && (
                            <div style={{ marginBottom: '0.25rem', opacity: 0.8 }}>
                              <strong>About:</strong> {exp.company_info.description}
                            </div>
                          )}
                          {exp.company_info.website && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>Website:</strong> <a href={exp.company_info.website} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>{exp.company_info.website}</a>
                            </div>
                          )}
                          {exp.company_info.company_linkedin_url && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>LinkedIn:</strong> <a href={exp.company_info.company_linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>View Company</a>
                            </div>
                          )}
                          {exp.company_info.crunchbase_url && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>Crunchbase:</strong> <a href={exp.company_info.crunchbase_url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>View on Crunchbase</a>
                            </div>
                          )}
                          {exp.company_info.twitter_url && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>Twitter:</strong> <a href={exp.company_info.twitter_url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>View on Twitter</a>
                            </div>
                          )}
                          {exp.company_info.facebook_url && (
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>Facebook:</strong> <a href={exp.company_info.facebook_url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>View on Facebook</a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {/* Education */}
          {filteredProfile.educations && filteredProfile.educations.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Education</h6>
              {filteredProfile.educations.map((edu: any, eduIdx: number) => (
                <div key={eduIdx} style={{ marginBottom: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {edu.major || edu.degree || edu.field_of_study || 'Education'}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    {edu.campus || edu.school || edu.university || edu.institution || 'Institution'}
                    {edu.specialization && ` • ${edu.specialization}`}
                  </div>
                  {edu.start_date && edu.end_date && (
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                      {new Date(edu.start_date).getFullYear()} - {new Date(edu.end_date).getFullYear()}
                    </div>
                  )}
                  {edu.university_linkedin_url && (
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      <a href={edu.university_linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}>
                        View University on LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Awards */}
          {filteredProfile.awards && filteredProfile.awards.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Awards & Recognition</h6>
              {filteredProfile.awards.map((award: string, awardIdx: number) => (
                <div key={awardIdx} style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                  🏆 {award}
                </div>
              ))}
            </div>
          )}
          
          {/* Certifications */}
          {filteredProfile.certifications && filteredProfile.certifications.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Certifications</h6>
              {filteredProfile.certifications.map((cert: any, certIdx: number) => (
                <div key={certIdx} style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                  🎓 {cert.name || cert.title || cert.certification || 'Certification'}
                  {cert.issuer && ` • ${cert.issuer}`}
                  {cert.issue_date && ` • ${new Date(cert.issue_date).getFullYear()}`}
                </div>
              ))}
            </div>
          )}
          
          {/* Memberships */}
          {filteredProfile.memberships && filteredProfile.memberships.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Professional Memberships</h6>
              {filteredProfile.memberships.map((membership: any, memIdx: number) => (
                <div key={memIdx} style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                  👥 {membership.organization || membership.name || membership.title || 'Membership'}
                  {membership.role && ` • ${membership.role}`}
                  {membership.start_date && membership.end_date && (
                    <span> • {new Date(membership.start_date).getFullYear()} - {new Date(membership.end_date).getFullYear()}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Patents */}
          {filteredProfile.patents && filteredProfile.patents.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Patents</h6>
              {filteredProfile.patents.map((patent: any, patentIdx: number) => (
                <div key={patentIdx} style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                  📄 {patent.title || patent.name || patent.patent || 'Patent'}
                  {patent.patent_number && ` • ${patent.patent_number}`}
                  {patent.issue_date && ` • ${new Date(patent.issue_date).getFullYear()}`}
                </div>
              ))}
            </div>
          )}
          
          {/* Publications */}
          {filteredProfile.publications && filteredProfile.publications.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h6 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem' }}>Publications</h6>
              {filteredProfile.publications.map((pub: any, pubIdx: number) => (
                <div key={pubIdx} style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                  📚 {pub.title || pub.name || pub.publication || 'Publication'}
                  {pub.publisher && ` • ${pub.publisher}`}
                  {pub.publication_date && ` • ${new Date(pub.publication_date).getFullYear()}`}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileRenderer; 