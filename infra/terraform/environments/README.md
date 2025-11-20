# Multi-Environment Infrastructure Setup

This directory contains Terraform configurations for different environments.

## Environment Structure

```
environments/
├── staging/      ← Deployed from `develop` branch
└── production/   ← Deployed from `main` branch
```

## Branch-to-Environment Mapping

| Branch | Environment | Behavior |
|--------|-------------|----------|
| `develop` | `staging` | Auto-apply (testing/pre-production) |
| `main` | `production` | Plan only + Manual approval required |

## Environment Differences

### Staging
- **VPC CIDR**: `10.1.0.0/16`
- **State Key**: `staging/terraform.tfstate`
- **Auto-apply**: Yes (on push to develop)
- **Approval**: Not required

### Production
- **VPC CIDR**: `10.2.0.0/16`
- **State Key**: `production/terraform.tfstate`
- **Auto-apply**: No (manual approval required)
- **Approval**: Required (configure in GitHub Environments)

## Workflow Behavior

### Push to `develop` branch
1. Determines environment: `staging`
2. Runs `terraform plan`
3. Auto-applies changes (no approval needed)

### Push to `main` branch
1. Determines environment: `production`
2. Runs `terraform plan`
3. **Does NOT auto-apply** (requires manual approval)

### Manual Trigger (`workflow_dispatch`)
- Select environment: `staging` or `production`
- Select action: `plan`, `apply`, or `destroy`
- Useful for on-demand deployments

## GitHub Environments Setup

Configure in GitHub Settings → Environments:

### Staging Environment
- Name: `staging`
- Protection rules: None (auto-apply)

### Production Environment
- Name: `production`
- Protection rules:
  - ✅ Required reviewers: 1 (or more)
  - ✅ Wait timer: Optional (recommended: 5 minutes)

### Destroy Environments
- `staging-destroy`: Require approval
- `production-destroy`: Require approval (critical!)

## State Management

Each environment uses separate Terraform state files:
- Staging: `s3://bucket/staging/terraform.tfstate`
- Production: `s3://bucket/production/terraform.tfstate`

This ensures complete isolation between environments.

## Security

- ✅ OIDC authentication (no access keys)
- ✅ Environment-specific state files
- ✅ Production requires manual approval
- ✅ Destroy operations require approval
- ✅ Secrets stored in GitHub Secrets

