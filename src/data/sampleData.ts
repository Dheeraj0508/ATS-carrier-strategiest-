import { MasterProfile } from '../types';

export interface SampleScenario {
  id: string;
  name: string;
  targetRole: string;
  companyName: string;
  badge: string;
  profile: MasterProfile;
  jobDescription: string;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'staff-fullstack',
    name: 'Alex Rivera — Senior Full-Stack Engineer',
    targetRole: 'Staff Distributed Systems Engineer',
    companyName: 'Stripe',
    badge: 'Fintech / Systems',
    profile: {
      personal_info: {
        name: 'Alex Rivera',
        email: 'alex.rivera.dev@gmail.com',
        phone: '+1 (415) 555-0192',
        linkedin: 'linkedin.com/in/alex-rivera-eng',
        location: 'San Francisco, CA',
      },
      target_career_track: 'Staff / Principal Full-Stack & Distributed Systems Engineer',
      skills: [
        'TypeScript',
        'Node.js',
        'React',
        'Next.js',
        'Go',
        'PostgreSQL',
        'Redis',
        'AWS (ECS, S3, RDS)',
        'GraphQL',
        'REST APIs',
        'Docker',
        'Microservices',
        'System Architecture',
        'CI/CD',
        'Jest',
        'Git',
      ],
      experience: [
        {
          company: 'FinPulse Technologies',
          role: 'Lead Senior Software Engineer',
          duration: 'Jan 2022 - Present',
          bullet_points: [
            'Architected and led the migration of a monolithic payment processing service into Go and Node.js microservices handling $450M in annual transactions with 99.99% uptime.',
            'Engineered real-time transaction webhook delivery engine using Redis Streams and PostgreSQL, cutting downstream delivery latency by 64% from 420ms to 150ms.',
            'Mentored 7 frontend and backend engineers, instituted strict code review benchmarks, and established automated integration testing suites improving test coverage from 68% to 92%.',
            'Implemented idempotency key protocols across distributed billing endpoints to prevent duplicate charges across concurrent requests.',
          ],
        },
        {
          company: 'Vanguard Cloud Solutions',
          role: 'Senior Full Stack Engineer',
          duration: 'Mar 2019 - Dec 2021',
          bullet_points: [
            'Spearheaded modern React and TypeScript frontend overhaul of the enterprise customer dashboard, decreasing initial bundle size by 38% and First Contentful Paint by 1.2s.',
            'Designed high-throughput REST and GraphQL APIs using Node.js and PostgreSQL serving over 18,000 active enterprise organizations.',
            'Constructed automated deployment pipelines using GitHub Actions, Docker, and AWS ECS, reducing deployment lead time from 4 days to 25 minutes.',
          ],
        },
        {
          company: 'Apex Digital Labs',
          role: 'Software Engineer',
          duration: 'Jul 2017 - Feb 2019',
          bullet_points: [
            'Developed full-stack web applications using React, Express, and SQL databases for high-growth client accounts.',
            'Optimized complex database queries with indexing and caching strategies, reducing median response times by 40%.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of California, Berkeley',
          year: '2017',
        },
      ],
    },
    jobDescription: `Stripe is looking for a Staff Distributed Systems Engineer to join our Core Global Payments Infrastructure team.

About the Role:
Our platform moves hundreds of billions of dollars each year for millions of businesses worldwide. You will be responsible for architecting, building, and operating the resilient distributed engines that execute every authorization, payout, and balance ledger update.

Key Responsibilities:
- Design and scale distributed, fault-tolerant transaction processing pipelines with strict sub-millisecond p99 latency guarantees.
- Drive architectural decisions across our event-driven architecture utilizing Apache Kafka, event sourcing, and high-concurrency storage systems.
- Partner with cross-functional product and security teams to implement PCI-DSS Level 1 compliance controls and distributed consensus mechanisms.
- Champion operational excellence, observability (Datadog, OpenTelemetry, Prometheus), and automated chaos engineering drills.
- Mentor senior engineers and define engineering-wide technical standards for high-availability systems.

Requirements:
- 7+ years of experience building mission-critical distributed systems and resilient microservices.
- Mastery in Go, Java, or Node.js/TypeScript within distributed cloud environments.
- Deep hands-on experience with Apache Kafka, message queues, and event-driven data streaming.
- Strong understanding of database internals, ACID guarantees, distributed consensus (Raft/Paxos), and idempotency.
- Proven track record with cloud-native monitoring, distributed tracing (OpenTelemetry), and telemetry instrumentation.
- Strong communication skills and cross-functional leadership in high-scale environments.`,
  },
  {
    id: 'ai-ml-engineer',
    name: 'Maya Chen — Senior Generative AI / ML Engineer',
    targetRole: 'Lead Applied AI / LLM Systems Engineer',
    companyName: 'Anthropic',
    badge: 'Applied AI & LLMs',
    profile: {
      personal_info: {
        name: 'Maya Chen',
        email: 'maya.chen.ai@gmail.com',
        phone: '+1 (206) 555-0841',
        linkedin: 'linkedin.com/in/maya-chen-ml',
        location: 'Seattle, WA',
      },
      target_career_track: 'Lead Applied Machine Learning & Generative AI Systems Engineer',
      skills: [
        'Python',
        'PyTorch',
        'Transformers',
        'Hugging Face',
        'LangChain',
        'LlamaIndex',
        'Vector Databases (Pinecone, ChromaDB)',
        'Retrieval-Augmented Generation (RAG)',
        'FastAPI',
        'Docker',
        'Kubernetes',
        'MLflow',
        'PostgreSQL',
        'AWS SageMaker',
      ],
      experience: [
        {
          company: 'CognitiveCore AI',
          role: 'Senior Machine Learning Engineer',
          duration: 'Feb 2022 - Present',
          bullet_points: [
            'Architected enterprise-grade RAG pipeline integrating dense passage retrieval, semantic reranking, and hybrid vector search over 12M customer documents, achieving 94% answer accuracy.',
            'Optimized model inference latency for multi-tenant LLM applications using quantization (vLLM, TensorRT-LLM), slashing token generation cost by 52% and p95 latency by 45%.',
            'Implemented automated LLM evaluation harnesses utilizing synthetic test sets and G-Eval criteria to detect hallucinations and benchmark retrieval relevancy.',
          ],
        },
        {
          company: 'DataSphere Analytics',
          role: 'Machine Learning Engineer',
          duration: 'Aug 2019 - Jan 2022',
          bullet_points: [
            'Trained and deployed deep learning NLP classification and NER models using PyTorch and Hugging Face, serving 250 requests/sec with FastAPI microservices.',
            'Constructed end-to-end MLOps training pipelines using Kubeflow and MLflow on AWS, standardizing experiment tracking across a 10-person research team.',
          ],
        },
      ],
      education: [
        {
          degree: 'Master of Science in Computational Data Science',
          institution: 'Carnegie Mellon University',
          year: '2019',
        },
      ],
    },
    jobDescription: `Anthropic is seeking a Lead Applied AI / LLM Systems Engineer to pioneer the next generation of safe, high-reliability enterprise agentic systems.

What you'll do:
- Design and implement state-of-the-art multi-agent orchestrations, tool-calling pipelines, and recursive reflection workflows.
- Build rigorous quantitative evaluation suites (automated red-teaming, ground-truth alignment testing, and safety guardrails).
- Scale production LLM inference clusters using vLLM, Triton Inference Server, and speculative decoding techniques.
- Collaborate with research scientists to translate frontier safety research (Constitutional AI) into bulletproof production APIs.

Requirements:
- 5+ years of software engineering and applied machine learning experience.
- Deep expertise with LLM fine-tuning (LoRA, QLoRA, DPO/RLHF) and agentic frameworks.
- Production proficiency with Triton Inference Server, speculative decoding, and GPU memory optimization (CUDA, vLLM).
- Strong foundation in automated safety guardrails, red-teaming methodologies, and prompt injection defense.
- Track record of deploying scalable ML inference services in production.`,
  },
  {
    id: 'devops-architect',
    name: 'David Kim — Cloud Platform & DevOps Architect',
    targetRole: 'Principal Platform & Reliability Engineer',
    companyName: 'Datadog',
    badge: 'Cloud & Infrastructure',
    profile: {
      personal_info: {
        name: 'David Kim',
        email: 'david.kim.infra@gmail.com',
        phone: '+1 (312) 555-0428',
        linkedin: 'linkedin.com/in/david-kim-cloud',
        location: 'Chicago, IL',
      },
      target_career_track: 'Principal Platform / Site Reliability Engineer',
      skills: [
        'Kubernetes',
        'Terraform',
        'AWS',
        'Google Cloud Platform',
        'Docker',
        'CI/CD (GitLab, GitHub Actions)',
        'Prometheus',
        'Grafana',
        'Linux Kernel / Bash',
        'Python',
        'Go',
        'ArgoCD',
        'Helm',
        'Vault',
      ],
      experience: [
        {
          company: 'Nexus Cloud Infrastructure',
          role: 'Staff Platform Engineer',
          duration: 'May 2021 - Present',
          bullet_points: [
            'Architected multi-region Kubernetes platform across AWS and GCP spanning 45 clusters and 1,200 microservice workloads with 99.995% SLA.',
            'Standardized Infrastructure-as-Code across 14 product squads using Terraform and Terragrunt, reducing environment provisioning time from 3 weeks to 18 minutes.',
            'Built zero-trust secrets management architecture using HashiCorp Vault with dynamic service account token rotation.',
          ],
        },
        {
          company: 'Orbital Health Systems',
          role: 'Senior DevOps / SRE Engineer',
          duration: 'Jan 2018 - Apr 2021',
          bullet_points: [
            'Established company-wide observability infrastructure with Prometheus, Grafana, and ELK stack, reducing Mean Time to Detection (MTTD) by 70%.',
            'Enforced HIPAA compliance standards, automated vulnerability scanning in container registries, and authored incident response runbooks.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Engineering',
          institution: 'University of Illinois Urbana-Champaign',
          year: '2017',
        },
      ],
    },
    jobDescription: `Datadog is seeking a Principal Platform & Reliability Engineer to scale our global infrastructure powering observability for Fortune 500 enterprises.

Responsibilities:
- Drive the architecture of zero-trust multi-cloud infrastructure running across tens of thousands of compute instances.
- Architect high-performance networking layers utilizing eBPF, Cilium service mesh, and Cilium Network Policies.
- Spearhead automated chaos engineering experiments and disaster recovery drills ensuring zero data loss during regional outages.
- Optimize cloud expenditure and FinOps telemetry, identifying resource waste and enforcing automated right-sizing policies.

Requirements:
- 8+ years architecting large-scale cloud-native platforms.
- Deep expertise with Kubernetes internals, eBPF, and service mesh technologies (Cilium or Istio).
- Mastery of Terraform, GitOps (ArgoCD / Flux), and multi-region high-availability topology.
- Proven FinOps experience driving multi-million dollar cloud cost optimization without compromising performance.
- Strong operational incident command and root cause analysis capabilities.`,
  },
];
