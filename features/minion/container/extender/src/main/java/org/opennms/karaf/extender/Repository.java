/*******************************************************************************
 * This file is part of OpenNMS(R).
 *
 * Copyright (C) 2016 The OpenNMS Group, Inc.
 * OpenNMS(R) is Copyright (C) 1999-2016 The OpenNMS Group, Inc.
 *
 * OpenNMS(R) is a registered trademark of The OpenNMS Group, Inc.
 *
 * OpenNMS(R) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * OpenNMS(R) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with OpenNMS(R).  If not, see:
 *      http://www.gnu.org/licenses/
 *
 * For more information contact:
 *     OpenNMS(R) Licensing <license@opennms.org>
 *     http://www.opennms.org/
 *     http://www.opennms.com/
 *******************************************************************************/

package org.opennms.karaf.extender;

import java.nio.file.Path;
import java.util.List;
import java.util.Objects;

import com.google.common.collect.ImmutableList;

public class Repository {
    private final Path m_path;
    private final List<String> m_featureUris;

    public Repository(Path path, List<String> featureUris) {
        m_path = Objects.requireNonNull(path);
        m_featureUris = ImmutableList.copyOf(featureUris);
    }

    public List<String> getFeatureUris() {
        return m_featureUris;
    }

    public String toMavenUri() {
        return String.format("file:%s@id=%s%s",
                m_path.toAbsolutePath().toString(),
                m_path.getFileName().toString(), containsSnapshots() ? "@snapshots" : "");
    }

    public boolean containsSnapshots() {
        return m_featureUris.stream()
                .filter(uri -> uri.contains("-SNAPSHOT"))
                .findFirst().isPresent();
    }

    @Override
    public String toString() {
        return String.format("Repository[path=%s, featureUris=%s]",
                m_path, m_featureUris);
    }

    @Override
    public int hashCode() {
        return Objects.hash(m_path, m_featureUris);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Repository other = (Repository) obj;
        return Objects.equals(this.m_path, other.m_path) &&
                Objects.equals(this.m_featureUris, other.m_featureUris);
    }
}
