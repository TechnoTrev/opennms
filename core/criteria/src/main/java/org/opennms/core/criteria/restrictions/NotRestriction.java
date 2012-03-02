package org.opennms.core.criteria.restrictions;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.springframework.core.style.ToStringCreator;

public class NotRestriction extends BaseRestriction {

	private final Restriction m_restriction;

	public NotRestriction(final Restriction restriction) {
		super(RestrictionType.NOT);
		m_restriction = restriction;
	}
	
	public Restriction getRestriction() {
		return m_restriction;
	}

	public org.hibernate.criterion.Criterion toCriterion() {
		return org.hibernate.criterion.Restrictions.not(getRestriction().toCriterion());
	}

    @Override
	public int hashCode() {
		return new HashCodeBuilder()
			.appendSuper(super.hashCode())
			.append(m_restriction)
			.toHashCode();
	}

    @Override
    public boolean equals(final Object obj) {
            if (obj == null) { return false; }
            if (obj == this) { return true; }
            if (obj.getClass() != getClass()) {
            	return false;
            }
            final NotRestriction that = (NotRestriction) obj;
            return new EqualsBuilder()
            	.appendSuper(super.equals(obj))
            	.append(this.getRestriction(), that.getRestriction())
            	.isEquals();
    }

    @Override
    public String toString() {
    	return new ToStringCreator(this)
    		.append("type", getType())
    		.append("restriction", m_restriction)
    		.toString();
    }
}
