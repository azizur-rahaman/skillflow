/**
 * Candidate Profile Page
 * 
 * 360° view of candidate showing verified skills, blockchain credentials,
 * projects, endorsements, and professional information for enterprise HR.
 */

'use client';

import { CandidateProfileProvider, useCandidateProfile } from '@/features/candidate-profile/context/CandidateProfileContext';
import { ProfileHeader } from '@/features/candidate-profile/presentation/components/ProfileHeader';
import { SkillGraphWidget } from '@/features/candidate-profile/presentation/components/SkillGraphWidget';
import { BlockchainCredentials } from '@/features/candidate-profile/presentation/components/BlockchainCredentials';
import { ProjectCarousel } from '@/features/candidate-profile/presentation/components/ProjectCarousel';
import { EndorsementsSection } from '@/features/candidate-profile/presentation/components/EndorsementsSection';

const CandidateProfileContent = () => {
  const { profile, isLoading, actions } = useCandidateProfile();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        onDownloadResume={() => actions.downloadResume('pdf')}
        onContact={actions.contactCandidate}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
        {/* Skill DNA Graph */}
        <section>
          <SkillGraphWidget
            skillDNA={profile.skillDNA}
            onSkillClick={actions.viewSkillDetails}
          />
        </section>
        
        {/* Blockchain Credentials */}
        {profile.blockchainCredentials.length > 0 && (
          <section>
            <BlockchainCredentials
              credentials={profile.blockchainCredentials}
              onViewOnChain={(cred) => actions.viewCredentialOnChain(cred.id)}
              onViewDetails={actions.viewCredentialOnChain}
            />
          </section>
        )}
        
        {/* Projects */}
        {profile.projects.length > 0 && (
          <section>
            <ProjectCarousel
              projects={profile.projects}
              onProjectClick={actions.viewProjectDetails}
            />
          </section>
        )}
        
        {/* Endorsements & Testimonials */}
        {(profile.endorsements.length > 0 || profile.testimonials.length > 0) && (
          <section>
            <EndorsementsSection
              endorsements={profile.endorsements}
              testimonials={profile.testimonials}
              onEndorserClick={(id) => console.log('View endorser:', id)}
            />
          </section>
        )}
        
        {/* Work Experience Timeline */}
        {profile.workExperience.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Work Experience</h2>
              <p className="text-sm text-slate-400">
                Professional journey and key achievements
              </p>
            </div>
            
            <div className="space-y-4">
              {profile.workExperience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="relative pl-8 pb-8 border-l-2 border-slate-700 last:border-transparent last:pb-0"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-slate-900" />
                  
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 hover:border-indigo-500 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {exp.position}
                        </h3>
                        <p className="text-indigo-400 font-medium mb-1">
                          {exp.company}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span>{exp.location}</span>
                          <span>•</span>
                          <span className="capitalize">{exp.employmentType.replace('-', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-slate-300">
                          {new Date(exp.duration.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {exp.duration.isCurrent ? ' Present' : ' ' + new Date(exp.duration.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                        {exp.duration.isCurrent && (
                          <div className="mt-1 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                            Current
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4">
                      {exp.description}
                    </p>
                    
                    {exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="text-indigo-400 mt-1">▪</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exp.techStack.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.techStack.map((tech, i) => (
                            <div
                              key={i}
                              className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300"
                            >
                              {tech}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Additional Info Section */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Languages */}
          {profile.personalInfo.languages.length > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Languages</h3>
              <div className="space-y-3">
                {profile.personalInfo.languages.map((lang, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-300">{lang.name}</span>
                    <span className="px-3 py-1 rounded-lg bg-slate-800/50 text-sm text-indigo-400 capitalize">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Preferences */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Work Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Work Mode</span>
                <span className="text-white capitalize">{profile.personalInfo.preferredWorkMode}</span>
              </div>
              {profile.professionalSummary.noticePeriod && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Notice Period</span>
                  <span className="text-white">{profile.professionalSummary.noticePeriod}</span>
                </div>
              )}
              {profile.professionalSummary.expectedSalary && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Expected Salary</span>
                  <span className="text-emerald-400 font-semibold">
                    ${profile.professionalSummary.expectedSalary.min.toLocaleString()} - ${profile.professionalSummary.expectedSalary.max.toLocaleString()}
                    <span className="text-xs text-slate-400 ml-1">/{profile.professionalSummary.expectedSalary.period}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default function CandidateProfilePage() {
  return (
    <CandidateProfileProvider>
      <CandidateProfileContent />
    </CandidateProfileProvider>
  );
}
